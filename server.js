const express=require('express');
const app=express();
const {open}=require('sqlite');
const sqlite3=require('sqlite3'); 
const path=require('path');
const { request, get } = require('http');

const dbPath=path.join(__dirname,'simpleTodos.db');
app.use(express.json());
let db;
const initializeDbAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })

        app.listen(3000,()=>{
            console.log('server is running on port 3000');
        })

    }catch(e){
        console.log(`DB Error:${e.message}`);
        process.exit(1);
    }
}
initializeDbAndServer();

app.get('/todos',async (request,response)=>{
    const getTodos=`
    select * from todo;`;
    const todos=await db.all(getTodos);
    response.send(todos);
    response.status(200);

})

app.delete('/todos/:id',async (request,response)=>{
    const {id}=request.params;
    const deleteTodos=`
    DELETE from todo where id =${id};`;
    await db.run(deleteTodos);
    response.send('Todo Deleted');
    response.status(200);
    
})

app.post('/todos',async (request,response)=>{
    const {title}=request.body;
    const postTodo=`
    INSERT INTO todo (title) VALUES ('${title}');`;
    await db.run(postTodo)
    response.send('Todo Successfully Added');
    response.status(200);
})