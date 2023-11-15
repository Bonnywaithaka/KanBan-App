"use client";
import { Box,Button,TextField,Typography } from '@mui/material'
import React,{useState,useMemo} from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Column, Id, Task } from '@/types';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useMutation,useQuery,gql } from '@apollo/client';
import Container from './Container';
import TaskComponent from './TaskComponent';

const GETCOLUMNS =gql `
query GetColumns {
    columns {
      id
      name
    }
  }
`;

const CREATE_COLUMN= gql `
mutation Mutation($input: CreateColumnInput!) {
    createColumn(input: $input) {
      id
      name
    }
  }
`;
const UPDATE_COLUMN= gql`
mutation UpdateColumn($updateColumnId: ID!, $input: UpdateColumnInput!) {
    updateColumn(id: $updateColumnId, input: $input) {
    name
    }
  }
`;
const DELETE_COLUMN=gql`
mutation DeleteColumn($deleteColumnId: ID!) {
    deleteColumn(id: $deleteColumnId) {
     id
     name
    }
  }
`;
const GET_TASKS = gql `
query GetTasks {
    task {
      id
      columnId
      taskName
    }
  }
`;
const CREATE_TASK = gql `
mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      columnId
      taskName
    }
  }
`;
const UPDATE_TASK= gql `
mutation UpdateTask($updateTaskId: ID, $input: UpdateTaskInput) {
    updateTask(id: $updateTaskId, input: $input) {
      id
      columnId
      taskName
    }
  }
`;
const DELETE_TASK = gql `
mutation DeleteTask($deleteTaskId: ID!) {
    deleteTask(id: $deleteTaskId) {
      id
      columnId
      taskName
    }
  }
`;

function MainPage() {
const {loading,error,data}= useQuery(GETCOLUMNS);
const{loading: taskLoading,error:taskError,data:tData}=useQuery(GET_TASKS);
const [createColumnMutation]=useMutation(CREATE_COLUMN,
    {
     refetchQueries: [
        GETCOLUMNS,
        'GetColumns' 
          ],
    })
const [updateColumn]=useMutation(UPDATE_COLUMN,
    {
        refetchQueries:[
            GETCOLUMNS,
            'GetColumns' 
              ],
            })
const [deleteColumns]=useMutation(DELETE_COLUMN,{
    refetchQueries: [
       GETCOLUMNS,
       'GetColumns' 
         ],
   });
   const [createTaskMutation]=useMutation<any>(CREATE_TASK, {
    refetchQueries: [
        GET_TASKS,
       'GetTasks' 
         ],
   })
const [updateTask]=useMutation<any>(UPDATE_TASK,{
    refetchQueries: [
        GET_TASKS,
       'GetTasks' 
         ],
})
   const [deleteTask]=useMutation<any>(DELETE_TASK,
    {
        refetchQueries: [
            GET_TASKS,
           'GetTasks' 
             ],
       }
    )
let columnData=data?.columns;
let taskData =tData?.task;
const [name,setName]=useState<string>();
const [createMode,setCreateMode]=useState(false);
const[columns,setColumns]=useState<Column[]>(columnData?[columnData]:[]);
const [activeColumn,setActiveColumn]=useState<Column|null>(null)
const [activeTask,setActiveTask]=useState<Task|null>(null)
const [tasks,setTasks]=useState<Task[]>(taskData?[taskData]:[]);
// const columnIds = useMemo(()=>columns?.map(col=>col.id),[columns])
const columnsCount=columnData?.length;
console.log("select count",columnsCount)
    const sensors = useSensors(
        useSensor(PointerSensor,{
            activationConstraint:{
                distance:1,
            },
        })
    );
    function createColumn(name:Column){
      createColumnMutation({
          variables:{
              input:{
                  name
              }
          }
      })
//       setColumns([...columnData,name])
// console.log("sumbua",columns)
          }
  function deleteCols(id:Id){
    deleteColumns({variables:{
        deleteColumnId: id
    }})
}
function deleteTasks(id:Id){
    deleteTask({variables:{
        deleteTaskId: id
    }})
}
function updateColumns(id:Id,name:string){
    updateColumn({
        variables:{
            updateColumnId:id,
            input:{
                name
            }
        }
    })
}
function createtask (columnId:Id,taskName:string){
  createTaskMutation(
    {
      variables:{
input:{
  columnId,
  taskName
}
  }})
}
function updateTasks(id:Id,columnId:Id,taskName:string){
    updateTask({
        variables:{
            updateTaskId:id,
            input:{
                columnId,
                taskName
            }
        }
    })
}
function onDragStart (event: DragStartEvent){
  console.log("DragStartEvent",event)
  if (event.active.data.current?.type === "Column"){
      setActiveColumn(event.active.data.current.column);
      return;
  }

  if (event.active.data.current?.type === "Task"){
      setActiveTask(event.active.data.current.task);
      return;
  }

}
function onDragEnd (event: DragEndEvent){
  console.log("DragEndEvent",event)

  // setActiveColumn(activeColumn)
  setActiveTask(activeTask)
const {active,over}=event;
if(!over)return;
const activeColumnId =active.id;
const overColumnId = over.id;

if (activeColumnId=== overColumnId)
return;
// setColumns((columns) =>{
// const activeColumnIndex = columnData.findIndex(
//   (col)=>col.id===activeColumnId
// );
// const overColumnIndex = columnData.findIndex(
//   (col)=>col.id===overColumnId
// );
// return arrayMove(columnData,activeColumnIndex,overColumnIndex);
// })
}

function onDragOver(event:DragOverEvent){
  setActiveColumn(activeColumn)
  setActiveTask(activeTask)
  setTasks(tasks)
  console.log("DragOverEvent",event)
  console.log(tasks)
  const {active,over}=event;
  if(!over)return;
  const activeId =active.id;
  const overId = over.id;
 
   if (activeId=== overId)
return;
console.log("overId",overId,activeId);

const isActiveATask = active.data.current?.type==="Task";
const isOverATask = over.data.current?.type==="Task";

// if(!isActiveATask) return;
// if(isActiveATask && isOverATask){
//   setTasks(taskData)
//  console.log("Morning tasks",taskData)
//   const activeIndex =taskData?.findIndex(t=>t.id===activeId)
//   console.log(activeIndex)
//   const overIndex =taskData?.findIndex(t=>t.id===overId)
//   taskData[activeIndex].columnId=taskData[overIndex].columnId;
//   return arrayMove(taskData,activeIndex,overIndex);
// updateTasks(
//   // active.data.current?.task.id,
//   activeTask.id,
//   over.data.current?.column?.id,
//   activeTask.taskName
// )

const isOverAColumn=over.data.current?.type==="Column";
//updating the task with the current column
if(isActiveATask && isOverAColumn){
  console.log("over a column task",tasks)
  // const activeIndex =taskData.findIndex(t=>t.id===activeId)
  // taskData[activeIndex].columnId=overId; 
  // return arrayMove(taskData,activeIndex,activeIndex);  
  updateTasks(
    // active.data.current?.task.id,
    activeTask.id,
    over.data.current?.column?.id,
    active.data.current?.task.taskName
  )

}
return;
}


if(loading){
    return<Box>Loading...</Box>
}
if(error){
    return<Box>{error.message}</Box>
}
  return (
    <Box>
         <DndContext 
        sensors={sensors} 
        onDragStart={onDragStart} 
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        >
        <Box 
        sx={{
    display:"flex"
}}
        >
        <Box sx={{
    display:"flex"
}}>
    
    {columnData?(columnData.map(colData=>(
        <Box key={colData.id}>
           <Container 
           column={colData}
           deleteCols={deleteCols}
           updateColumn={updateColumns}
           createTasks={createtask}
           deleteTask={deleteTasks}
           updateTask={updateTasks}
           tasks={taskData?(taskData.filter(task=>task.columnId===colData.id)):[]}
           />
          
        </Box>
    ))):<Box>Loading...</Box>}
  
  
</Box>
<Box sx={{ 
  display:"flex",
  minHeight:20, 
  minWidth:300, 
  justifyContent:"center",
  alignItems:"start",
  marginTop:2
  }}>
    {columnsCount===5 && 
    <Box
    sx={{
      display:"flex",
      justifyContent:"center",
      color:"red",
      height:50,
      padding:8,
    }}
    >
      You Can only Add Upto 5 colums!!
      
      </Box>}

   {!createMode && columnsCount<5 &&<Button variant="outlined" size="small" startIcon={<AddIcon />}
   sx={{
    padding:"5px 50px",
    textTransform:"none"
   }}
   onClick={()=>{
    setCreateMode(true)
   }}
   >
    Add Column   
</Button>}
{createMode && 
<Box sx={{width:250,
        minHeight:100,
        padding:2,
        display:"flex",
        flexDirection:"column"
        }}>
    <Box
    sx={{
       padding:"0px 5px"
    }}
    >
        <TextField 
        autoFocus
        value={columnData.name}
        type='text'
        label='Name'
        onChange={(e)=>{
        setName(e.target.value)
        }}
        onKeyDown={(e)=>{
            if(e.key!=="Enter") return;
        createColumn(name)
            setCreateMode(false)
        }}
        />
    </Box>
    <Box sx={{display:"flex", 
    justifyContent:"space-between", 
    padding:"5px 25px 10px 0px",
    }}>
    <Button 
     sx={{
      height:30,
      width:20,
      textTransform:"none"
    }}
    size="small"  onClick={()=>{setCreateMode(false)}}>Cancel</Button> 
    <Button size="small"  variant='contained' 
    sx={{
      height:30,
      width:20,
      textTransform:"none"
    }}
    onClick={()=>{
        createColumn(name)
       setCreateMode(false)
        }}>Add</Button>
    </Box>
    </Box>}
</Box>
        </Box>
        {createPortal(
         <DragOverlay>
            {activeColumn && (<Container 
            key={activeColumn.id}
            column={activeColumn} 
            createTasks={createtask}
            deleteTask={deleteTasks}
            updateTask={updateTasks}
            updateColumn={updateColumns}
            deleteCols={deleteCols}
            tasks={tasks.filter(task=>task.columnId===activeColumn.id)}
            
            />)}
        {activeTask && <TaskComponent task={activeTask}
        deleteTask={deleteTasks}
        updateTask={updateTasks}/>}
        </DragOverlay>,
        document.body
        )}
             </DndContext>

    </Box>
  )
}

export default MainPage