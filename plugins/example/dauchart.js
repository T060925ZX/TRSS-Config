import plugin from '../../lib/plugins/plugin.js'
import fs from 'fs'
import fetch from 'node-fetch'
import yaml from 'yaml'
import moment from 'moment'
const groupPath = './plugins/example/group_id.yaml'
const userPath = './plugins/example/user_id.yaml'
const days=6
let data = ''
if (fs.existsSync(userPath))
    data = fs.readFileSync(userPath, 'utf8');
else{
    fs.writeFileSync(userPath, data, 'utf8');
}
let user_list = yaml.parse(data) || {};
if (fs.existsSync(groupPath))
    data = fs.readFileSync(groupPath, 'utf8');
else{
    fs.writeFileSync(groupPath, data, 'utf8');
}
let group_list = yaml.parse(data) || {};
export class example extends plugin {
    constructor() {
        super({
            name: 'dauchart',
            dsc: 'dauchart',
            event: 'message',
            priority: -1000005,
            rule: [
                {
                    reg: "^#?(qqbot)?dau$",
                    fnc: 'dau'
                },
                {
                    reg: "",
                    fnc: "dau_write",
                    log: false
                }
            ]
        })
    }
    async dau_write(e){
	const today = new Date().toLocaleDateString(); // 获取今天的日期
	if (!user_list[today]) {
            user_list[today] = [];
        }
        if (!group_list[today]) {
            group_list[today] = [];
        }

        let yamlString
        if (!user_list[today].includes(e.user_id)) {
            user_list[today].push(e.user_id);
            yamlString = yaml.stringify(user_list);
            fs.writeFileSync(userPath, yamlString, 'utf8');
        }
        let group_id
        group_id = e.guild_id || e.group_id
        console.log(group_id)
        if (!group_list[today].includes(group_id)) {
            group_list[today].push(group_id);
            yamlString = yaml.stringify(group_list);
            fs.writeFileSync(groupPath, yamlString, 'utf8');
        }
        return false
    }
    async getMessageCountByDate(date) {
        this.key = 'Yz:count:'
        date = moment(date).format('MMDD')
        let msgKey = `${this.key}sendMsg:day:${date}`
        let msgCount = await redis.get(msgKey) || 0
        return msgCount
    }
    async dau(e){
	let groupnum=[]
	let usernum=[]
	let msgnum=[]
	let datanum=[]
	let user_sum = 0;
        let group_sum = 0;
        let day = 0;
        if (user_list=="{}"||group_list=="{}")
            return await e.reply("当前无数据")
        const today = new Date().toLocaleDateString()
        const xDaysAgo = []
        let userCounts = {};
        for(let i = days; i >= 0; i--)
            xDaysAgo.push(new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString())
        logger.info(xDaysAgo)
        for (const date of xDaysAgo) {
            if (user_list[date]){
				userCounts[date] = `${user_list[date].length}人 ${group_list[date].length}群`;
                if(date < today) {
                    user_sum += user_list[date].length
                    group_sum += group_list[date].length
                    day++
                }
                groupnum.push(group_list[date].length)
                usernum.push(user_list[date].length)
                msgnum.push(await this.getMessageCountByDate(date))
                datanum.push(date)
            }
            else {
                groupnum.push(0)
                usernum.push(0)
                msgnum.push(await this.getMessageCountByDate(date))
                datanum.push(date)
            }
        }
        e.reply(`${yaml.stringify(userCounts)}\n${(day+1)}日平均：${Math.floor(user_sum/day) || 0}人 ${Math.floor(group_sum/day) || 0}群`)
        this.dau_write(e)
        logger.info(groupnum)
        logger.info(usernum)
        logger.info(msgnum)
        logger.info(datanum)
        let url=encodeURI('https://quickchart.io/chart?c='+`{type:'bar',data:{labels:['${datanum[0]}','${datanum[1]}','${datanum[2]}','${datanum[3]}','${datanum[4]}','${datanum[5]}','${datanum[6]}'],datasets:[{'label':'Users','backgroundColor':'rgba(255,99,132,0.5)',yAxisID: 'y1','borderColor':'rgb(255,99,132)','borderWidth':1,'data':[${usernum}]},{'type':'line','label':'Groups','data':[${groupnum}],yAxisID: 'y1','borderColor':'rgb(54,162,235)','borderWidth':2,fill:false},{'type':'line','label':'Msgnum','data':[${msgnum}],'yAxisID': 'y2','borderColor':'rgb(0,204,128)','borderWidth':2,fill:false}]},'options':{'title':{'display':true,'text':'小栖本周数据统计'},'scales': {'xAxes': [{'stacked': true,},],'yAxes': [{'id': 'y1','ticks':{'max':5000},'display': true,'position': 'left','stacked': true,},{'id': 'y2','ticks':{'min':0},'display': true,'position': 'right','gridLines': {'drawOnChartArea': false,},},],},'plugins':{'datalabels':{'anchor':'end','align':'top','color':'rgba(34,139,34,1.0)','borderColor':'rgba(34,139,34,1.0)',borderWidth:1,borderRadius:5}}}}`)
        //let url1=encodeURI('https://quickchart.io/chart?c='+`{type:'bar',data:{labels:['${datanum[0]}','${datanum[1]}','${datanum[2]}','${datanum[3]}','${datanum[4]}','${datanum[5]}','${datanum[6]}'],datasets:[{'type':'line','label':'Msgnum','data':[${msgnum}],'borderColor':'rgb(54,162,235)','borderWidth':2,fill:false}]},'options':{'title':{'display':true,'text':'小白露本周数据统计'},'plugins':{'datalabels':{'anchor':'end','align':'top','color':'rgba(34,139,34,1.0)','borderColor':'rgba(34,139,34,1.0)',borderWidth:1,borderRadius:5}}}}`)
	var localPath = './dauimg.jpg';
        await fetch(url)
            .then(function(response) {
                if (response.ok) {
                    return response.buffer();
                } else {
                    throw new Error('图片获取失败');
                }
            })
            .then(function(buffer) {
                fs.writeFile(localPath, buffer, function(error) {
                    if (error) {
                        console.error(error);
                    } else {
                        e.reply(segment.image(localPath));
                    }
                });
            })
            .catch(function(error) {
                console.error(error);
            });
        //var localPath1 = './msgimg.jpg';
        //await fetch(url1)
            //.then(function(response) {
                //if (response.ok) {
                    //return response.buffer();
        //        } else {
          //          throw new Error('图片获取失败');
          //      }
         //   })
         //   .then(function(buffer) {
           //     fs.writeFile(localPath1, buffer, function(error) {
             //       if (error) {
               //         console.error(error);
                 //   } else {
                   //     e.reply(segment.image(localPath1));
                    //}
           //     });
           // })
           // .catch(function(error) {
            //    console.error(error);
            //});
        groupnum=[]
        usernum=[]
        datanum=[]
        msgnum=[]
    }
}
