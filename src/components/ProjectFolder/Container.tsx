"use client";
import React, { useState,useMemo } from 'react'
import {Box,Button,Divider, TextField} from '@mui/material'
import { Column, Id, Task } from '@/types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities'
import OptionsMenu from '../OptionsMenu';
import TaskComponent from './TaskComponent';

interface Props {
    column:Column;
    updateColumn:(id:Id, name:string)=>void;
    deleteCols:(id:Id)=>void

    createTasks:(columnId:Id, taskName:string)=>void;
    tasks:Task[];
    deleteTask:(id:Id)=>void;
    updateTask:(id:Id,columnId:Id,taskName:string)=>void;
}
function Container(props:Props) {
    const{column,updateColumn,createTasks,tasks,deleteTask,updateTask,deleteCols}=props
    const[newColName,setNewColName]=useState<string>(column.name)
    const [editMode, setEditMode]= useState(false)
    const [editTaskMode,setEditTaskMode]=useState(false)
    const [taskNames,setTaskNames]=useState<string>()
    // let taskName=taskNames;
console.log(editTaskMode)
    const tasksIds = useMemo(()=>{
        return tasks?.map(task=> task.id);
    }, [tasks])

    const{setNodeRef,attributes,listeners,transform,transition,}=useSortable({
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
    // if(isDragging){
    //     console.log("isDragging container",isDragging)
    //     return <Box  ref={setNodeRef}
    //     style={style}  sx={{
    //         width:250,
    //         minHeight:100,
    //         backgroundColor:"#fff",
    //         gap:4,
    //         margin:2,
    //         borderRadius:2,
    //         border:"solid 2px #000",
    //         padding:1,
    //         alignItems:"center"
    
    //     }}>{column.name}</Box>
    // }
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
            }}
            >{!editMode && column.name}
            {editMode && 
            <TextField 
            autoFocus 
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
    <OptionsMenu 
    deleteCols={deleteCols} 
    column={column}
    setEditTaskMode={setEditTaskMode}
    />

</Box>
        </Box>
        <Divider orientation="horizontal" variant="fullWidth" />
        <Box sx={{
            minHeight:40
        }}>
            <SortableContext items={tasks}>

            {tasks?.map(task=>(
                <TaskComponent key={task.id} task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}/>
            ))}
            </SortableContext>
           
        </Box>
        <Divider orientation="horizontal" variant="fullWidth" sx={{height:2}}/>
<Box sx={{
    display:"flex",
    justifyContent:"center",
    backgroundColor:"#fff"
}}>
   
</Box>
<Box sx={{
    display:"flex",
    justifyContent:'center'
}}>
    {!editTaskMode &&  
    <Button 
    sx={{
        padding:"5px 80px"
    }}
    onClick={()=>{
        setEditTaskMode(true)
        
    }}
    >Add Task</Button>}
    {editTaskMode && <Box>
        <Box
        sx={{
            marginTop:1,
        }}
        >
            <TextField 
           inputProps={{
            height:10
           }}
        type="text"
        label="Name"
        autoFocus
        value={tasks.taskName}
        onBlur={()=>{
            setEditTaskMode(false)
        }}
        onChange={(e)=>{
            setTaskNames(e.target.value)
          
        }}
        onKeyDown={(e)=>{
            if(e.key!=="Enter")return;
            createTasks(
                column.id,
                taskNames
                )
            setEditTaskMode(false)
        }}
        /></Box>
        <Box 
        
        sx={{
            display:"flex",
            justifyContent:"space-between",
            marginTop:1,
        }}>
            <Button 
            sx={{
                height:30,
                width:20, 
            }}
            onClick={()=>{
                setEditTaskMode(false)
            }}>Cancel</Button>
            <Button variant='contained' sx={{
                    height:30,
                    width:20,                  
            }}
            onClick={
                ()=>{
                createTasks(
                        column.id,
                        taskName
                )
                setEditTaskMode(false)
                  
            }
            }>Add</Button>
        </Box>
        </Box>}
</Box>
</Box>
  )
}

export default Container