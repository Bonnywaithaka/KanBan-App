import { Id, Task } from '@/types'
import React, { useState } from 'react'
import { Box,Button, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface Props{
    task:Task
    deleteTask:(id:Number)=>void;
    updateTask:(id:Id,columnId:number, taskname:string)=>void;
}

function TaskCard({task,deleteTask,updateTask}:Props) {
    const [newTaskName,setNewTaskName]=useState<string>(task.taskName)
    const [editMode,setEditMode]= useState(false);
    const{setNodeRef,attributes,listeners,transform,transition,isDragging}=useSortable({
        id:task.id,
        data:{
            type:"Task",
            task
        },
        disabled: editMode,
    });
    const style = {
        transition,
        transform:CSS.Transform.toString(transform),
    }
    const toggleEditmode =()=>{
setEditMode((prev)=>!prev);
    }
    if (isDragging){
        return<Box      
        ref={setNodeRef}
        style={style}/>
    }
    if(editMode)
    {
        return<Box  
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        >
            <TextField
            autoFocus
            value={newTaskName}
            onBlur={()=>{
                setEditMode(false)
            }}
            onKeyDown={(e)=>{
                if(e.key==="Enter" 
                ) {
                    updateTask(task.id,task.columnId,newTaskName)
                    toggleEditmode();
                }
            }}
            onChange={(e)=>{
                setNewTaskName(e.target.value)
            }}
            />
            </Box>
    }
  return (
    <Box
    
    ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
            backgroundColor:"#F5F5F5" ,
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            margin:1,
            }}>
        <Box 
        sx={{
            width:"80%",
            backgroundColor:"#F5F5F5",
            padding:1, 
        }}
        
        onClick={toggleEditmode}> {task.taskName}</Box>
       
    
    <Button onClick={
        ()=>{
            deleteTask(task.id)
        }
    }>
        <DeleteIcon/>
    </Button>

    </Box>
  )
}

export default TaskCard