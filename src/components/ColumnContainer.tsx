"use client";
import React, { useState,useMemo } from 'react'
import {Box,Button,Divider, TextField} from '@mui/material'
import { Column, Id, Task } from '@/types';
import OptionsMenu from './OptionsMenu';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities'
import TaskCard from './TaskCard';

interface Props {
    column:Column;
    updateColumn:(id:Id, name:string)=>void;
    deleteCols:(id:Id)=>void

    createTasks:(columnId:Id, taskName:string)=>void;
    tasks:Task[];
    deleteTask:(id:Number)=>void;
    updateTask:(id:number,columnId:number,taskName:string)=>void;
}
function ColumnContainer(props:Props) {
    const{column,updateColumn,createTasks,tasks,deleteTask,updateTask,deleteCols}=props
    const[newColName,setNewColName]=useState<string>(column.name)
    const [editMode, setEditMode]= useState(false)
    const [editTaskMode,setEditTaskMode]=useState(false)
    const [taskNames,setTaskNames]=useState()
    let taskName=taskNames;

    // const tasksIds = useMemo(()=>{
    //     return tasks?.map(task=> task.id);
    // }, [tasks])

    const{setNodeRef,attributes,listeners,transform,transition,isDragging}=useSortable({
        id:column.id,
        data:{
            type:"Column",
            column
        },
        disabled: editMode,
    });
    const style = {
        transition,
        transform:CSS.Transform.toString(transform),
    }
    if(isDragging){
        return <Box  ref={setNodeRef}
        style={style}  sx={{
            width:250,
            minHeight:100,
            backgroundColor:"#fff",
            gap:4,
            margin:2,
            borderRadius:2,
            border:"solid 2px #000",
            padding:1
    
        }}>{column.name}</Box>
    }
  return (
    <Box
    ref={setNodeRef}
    style={style}
    sx={{
        width:250,
        minHeight:100,
        backgroundColor:"#fff",
        gap:4,
        margin:2,
        borderRadius:2,
        border:"solid 1px #000",
        padding:1

    }}>
        <Box sx={{
            display:"flex",
            justifyContent:'space-between',
            alignItems:"center",
            padding:1,
        }}
        {...attributes}
        {...listeners}
        onClick={()=>{
            setEditMode(true)
           
        }}
        >
            <Box sx={{
            width:"90%"
            }}>{!editMode && column.name}
            {editMode && 
            <TextField autoFocus 
            value={newColName}
            onChange={(e)=>
                {
                    setNewColName(e.target.value)
                }
                } 
            onBlur={()=>setEditMode(false)}
            onKeyDown={(e)=>{
                if(e.key!=="Enter") return;
                updateColumn(column.id,newColName)
                setEditMode(false)
            }}
            />} 
            
            
            </Box>
         <Box>
    <OptionsMenu  updateColumn={updateColumn} deleteCols={deleteCols} column={column}/>

</Box>
        </Box>
        <Divider orientation="horizontal" variant="fullWidth" />
        <Box sx={{
            minHeight:40
        }}>
            <SortableContext items={tasks}>

            {tasks?(tasks.map(task=>(
                <TaskCard key={task.id} task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}/>
            ))):<Box>Loading...</Box>}
            </SortableContext>
           
        </Box>
        <Divider orientation="horizontal" variant="fullWidth" sx={{height:2}}/>
<Box sx={{
    display:"flex",
    justifyContent:"center",
    backgroundColor:"#fff"
}}>
   
</Box>
<Box>
    {!editTaskMode &&  <Button 
    onClick={()=>{
        setEditTaskMode(true)
        
    }}
    >Add Task</Button>}
    {editTaskMode && <Box>
        <Box><TextField 
        type="text"
        label="name"
        value={tasks.taskNames}
        onChange={(e)=>{
            setTaskNames(e.target.value)
          
        }}
        onKeyDown={(e)=>{
            if(e.key!=="Enter")return;
            createTasks({variables:{
                input:{
                    columnId:column.id,
                    taskName
                }
            }})
            setEditTaskMode(false)
        }}
        /></Box>
        <Box>
            <Button onClick={()=>{
                setEditTaskMode(false)
            }}>Cancel</Button>
            <Button variant='contained' sx={{
                
            }}
            onClick={
                ()=>{
                createTasks({variables:{
                    input:{
                        columnId:column.id,
                        taskName
                    }
                }})
                setEditTaskMode(false)
                  
            }
            }>Add</Button>
        </Box>
        </Box>}
</Box>
</Box>
  )
}

export default ColumnContainer