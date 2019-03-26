# loopback-connector-ersoft-go
此connector解析器是专门为loopback3连接后台restful接口并将其自动挂载到loopback3自动生成的restful接口上，这只是一个基础框架，支持按照自己的业务改动

# 后台所需实现的接口

因为此解析包需要后台资源的配合，所以后台资源应实现以下方法，以达到对loopback3的所有自动生成的restful接口的完全支持:

find
此方法映射loopback3的restful中的find、findOne、findById以及它们的变种count，此方法是最基础方法，请务必支持！
入参:
filter(包含:fields,limit,order,skip),
filter是可选项，如果不填则默认为null
filter中在前端包含include，但后台不需要支持，中台会自动支持include


let filter = {
 
    where: {
 
        name: 'test',
 
        age: {
 
            gte: 17,
 
        },
 
    },
 
    fields: {
 
        id: false,
 
    },
 
    order: [
 
        'id DESC',
 
        'age DESC',
 
    ],
 
    limit: 5,
 
    skip: 1,
 
};



出参:
对象数组,未得到查询结果时返回空数组[]


[
  {
    "title": "string",
    "content": "string",
    "id": "string"
  }
]


参考文档

 

create
创建对象，对应POST /modelName 方法，此方法只为创建某个表的对象，但却和find一样基础，同时也是findOrCreate组合方法的基础方法，请务必支持！

入参:

data 创建对象所需对象的必填字段，希望支持冗余字段(用户多填的的关键字，可以不用读取，希望后台支持冗余，这样业务上和数据上的操作更加灵活)，如:

{
  "title": "string",
  "content": "string"
}


出参：创建的对象，但我在解析的时候只会取id(其他的参数以用户填的数据为标准)，但还是希望能支持返回对象就返回对象

{
  "title": "string",
  "content": "string",
  "id": 0
}


update

update有点复杂，这里希望后台能支持两种方法update，和replaceById

(1)update

此方法会根据where条件支持单一属性更新，不需要全量

入参：

1）where

查询语句的对象，如：{id:4}

2）data

需要更改的属性值，如：

{
    where:{id:4},
    data:{
        title:"hh4"
    }
}
更改所有id属性为4的对象的title值为”hh4“
(2)replaceById

此方法是全量更新，提供一个id，并替换其全部属性的值，此方法会在更新此id的对象之前由中台使用find自动验证其id是否存在，不存在则不会去调用后台方法，存在则会获取id，使用id调用此方法，所以后台只需实现全量更新即可，
入参：
id
所要全量更新的条目的id


data
更新的数据


如：

{
    id:4,
    data:{
        "title": "string",
        "content": "string",
        "id": 4 //此处id为冗余字段，如果后台不希望看到则我在中台解析的时候会删除
    }
}
destroyAll

根据条件删除所得的所有条目，destroyById和destroy则会自动转化条件{where:{id:4}}

入参：
 where
查询语句，参考find
如:

GET where={"id":4}
POST {where:{id:4}}
DELETE where={"id":4}

只要实现以上四类共五种方法，则可以基本完美支持loopback3的自动生成的所有的方法！

# 改造

改造参考文档：https://loopback.io/doc/en/lb3/Building-a-connector.html#notes-for-creating-non-database-connectors