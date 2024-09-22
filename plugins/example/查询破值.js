import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

// 作者 ChatGPT.com

export class DatabasePlugin extends plugin {
  constructor() {
    super({
      name: '查询破值',
      event: 'message',
      rule: [
        {
          reg: "^#查询破值$",
          fnc: 'runDatabaseCheck'
        }
      ]
    });
  }

  async runDatabaseCheck(e) {

   e.reply('少女祈祷中...', true);
  	
    const dbFilePath = 'data/db/data.db';
    const db = new sqlite3.Database(dbFilePath);

    // 用于存储出现次数的结果
    const result = {};
    let totalOccurrences = 0; // 总出现次数
    let totalTables = 0; // 总表数
    let totalColumns = 0; // 总列数

    // 获取文件大小并格式化
    const getFileSize = (filePath) => {
      try {
        const stats = fs.statSync(filePath);
        let size = stats.size;
        let unit = 'Bytes';

        if (size >= 1024) {
          size /= 1024;
          unit = 'KB';
          if (size >= 1024) {
            size /= 1024;
            unit = 'MB';
            if (size >= 1024) {
              size /= 1024;
              unit = 'GB';
            }
          }
        }

        return `${size.toFixed(2)} ${unit}`;
      } catch (error) {
        console.error('无法获取文件大小:', error);
        return '未知';
      }
    };

    // 获取所有表名
    db.serialize(() => {
      db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
        if (err) {
          e.reply('查询表名时出错。');
          db.close();
          return;
        }

        totalTables = tables.length; // 统计总表数

        const checkTable = (index) => {
          if (index >= tables.length) {
            // 完成所有表的检查
            let replyMessage = `总表 ${totalTables}\n总列 ${totalColumns}\n`;

            for (const key in result) {
              if (result.hasOwnProperty(key)) {
                const { table, column, count } = result[key];
                replyMessage += `表 ${table} 列 ${column} 次数 ${count}\n`;
              }
            }
            replyMessage += `共有 ${totalOccurrences}\n`;
            
            // 输出数据库文件大小
            replyMessage += `${getFileSize(dbFilePath)}`;
            
            e.reply(replyMessage, true);
            db.close();
            return;
          }

          const tableName = tables[index].name;

          // 获取当前表的所有列
          db.all(`PRAGMA table_info(${tableName});`, [], (err, columns) => {
            if (err) {
              e.reply('查询列信息时出错。');
              db.close();
              return;
            }

            totalColumns += columns.length; // 统计总列数

            const columnNames = columns.map(column => column.name);

            // 检查每个列中是否包含 '[object Object]'
            const checkColumn = (colIndex) => {
              if (colIndex >= columnNames.length) {
                // 处理完所有列
                checkTable(index + 1);
                return;
              }

              const columnName = columnNames[colIndex];

              db.all(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${columnName} LIKE '%[object Object]%';`, [], (err, rows) => {
                if (err) {
                  e.reply('查询数据时出错。');
                  db.close();
                  return;
                }

                const count = rows[0].count;
                if (count > 0) {
                  result[`${tableName}:${columnName}`] = { count: count, table: tableName, column: columnName };
                  totalOccurrences += count; // 更新总出现次数
                }

                checkColumn(colIndex + 1);
              });
            };

            checkColumn(0);
          });
        };

        checkTable(0);
      });
    });
  }
}
