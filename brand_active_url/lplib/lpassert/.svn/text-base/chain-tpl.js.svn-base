/**
 * @fileOverview 
 */
KISSY.add(function(S){
  var tmp =  {
        "0":'<ul><li>责任人：{{name}}</li><li>状态：{{status}}</li><li>下载报告</li></ul>',
        "1":'<ul><li>责任人：{{name}}</li><li>状态：{{status}}</li><li>下载报告</li></ul>',
        "2":'<ul>\
          <li>责任人：{{name}}</li>\
          <li>采购单号：{{number}}</li>\
          <li>状态：{{status}}</li>\
          <li>创建时间：{{startTime}}</li>\
          <li>实际定量：{{count}}</li>\
          <li>结算方式：{{clearing}}</li>\
          </ul>',
        "3":'<ul><li>责任人：{{name}}</li>\
        <li>当前批次已入库：{{inStore}}，消耗：{{sale}},现余：{{remain}}</li>\
        <li>spu现余库存：{{spuRemain}}，可用共享：{{share}}</li>\
        <li><table class="table"><thead><td>当前批次入库单</td><td width="50px">类型</td><td width="50px">数量</td><td width="50px">状态</td></thead>\
          <tbody>\
          {{#each list as record}}\
          <tr><td>{{record.id}}</td><td>{{record.type}}</td><td>{{record.number}}</td><td>{{record.status}}</td></tr>\
          {{/each}}\
          </tbody>\
          </table></li>\
        </ul>',
        "4":'<ul><li>任务责任人：{{name}}</li>\
          <li><table class="table"><thead><td>单号</td><td>数量</td><td>状态</td><td>结果</td></thead>\
          <tbody>\
          {{#each list as record}}\
          <tr><td>{{record.id}}</td><td>{{record.number}}</td><td>{{record.status}}</td><td>{{record.result}}</td></tr>\
          {{/each}}\
          </tbody>\
          </table></li></ul>',
        "5":'<ul>\
              <li>责任人：{{name}}</li>\
              <li>包装名称：{{wrapName}}<a href="#">详情</a></li>\
              <li>状态：{{status}}</li>\
            </ul>',
        "6":'<ul>\
              <li>责任人：{{name}}</li>\
              <li>已销售数量：{{saleNumber}},spu历史销售：{{history}}</li>\
              <li><table class="table"><thead><td>渠道（店铺）</td><td>宝贝ID</td><td>状态</td><td>在售数量</td><td>当前批次销量</td><td>历史累计销量</td></thead>\
                <tbody>\
                {{#each list as record}}\
                <tr><td>{{record.chanel}}</td><td>{{record.id}}</td><td>{{record.status}}</td><td>{{record.saleNumber}}</td><td>{{record.curSale}}</td><td>{{record.historySale}}</td></tr>\
                {{/each}}\
                </tbody>\
                </table></li>\
            </ul>'
      };

  return tmp;
});