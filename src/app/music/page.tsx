"use client"

import React, { useCallback, useEffect, useState, } from 'react'
import { Table, TableHeader, TableColumn, TableRow, TableCell, TableBody, getKeyValue, ChipProps, Tooltip, User, Chip, Button, } from '@nextui-org/react'
import headDashboard from '../dashboard/headDashboard'
import {EyeIcon} from './../component/icon/EyeIcon'
import {DeleteIcon} from './../component/icon/DeleteIcon'
import {EditIcon} from './../component/icon/EditIcon'
import {songs, song} from './../data/data'
import { NextApiRequest } from 'next'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'
import { deleteProject, getProjectList } from '../../../services/manage'
import Link from 'next/link'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";



type User = typeof users[0];


export default  function Dashboard() {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [projectList, setProjectlist] = useState([]);
  const [idHapus, setIdHapus] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const getProjectListAPI = useCallback( async () =>{
  const data = await getProjectList()
  setProjectlist(data.data)

  if(data.status > 300 ){
    toast.error(data.message)
  }

  },[getProjectList])

  useEffect(()=>{
    getProjectListAPI()
    
  },[])

  // if(!token) {
  //   router.replace('/login');
  //   }

  const handleFiles = (event) => {
    const files = event.target.files;
    setAudioSrc(URL.createObjectURL(files[0]));
  };

  const openModalWithID = (id) => {
    setIdHapus(id);
    onOpen();
  };
  
  const hapusHandler = async () => {
    const ROOT_API = process.env.NEXT_PUBLIC_API;
    try {
      
      const response = await deleteProject(idHapus);
      
      if (response.status >= 200 && response.status < 300) {
          onClose();
          toast.success("Berhasil di Hapus",
            {   
              onClose: () => {
                setTimeout(()=>{
                  window.location.reload();
                },500)
            }
            });
        //  router.push('/dashboard');
      } else {
          toast.error(response.message);
      }
  } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal di Publish');
  }
  }
    

  const renderCell = React.useCallback((user: User, columnKey: React.Key,  id: string) => {
    const cellValue = user[columnKey as keyof User];
  
    switch (columnKey) {
      case "judul":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-xs text-gold capitalize">{user.email}</p>
          </div>
        );
      case "kategori":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-xs text-gold capitalize">{user.template}</p>
          </div>
        );
      case "menu":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Play">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
           
            <Tooltip color="danger" content="Delete Song">
            <button className="text-lg text-danger cursor-pointer active:opacity-50" type='button' onClick={() => openModalWithID(id)} >
            <DeleteIcon />
            </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);


  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Konfirmasi Hapus</ModalHeader>
              <ModalBody>
                <p> 
                  Project akan dihapus ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" onPress={hapusHandler}>
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    <section>
        {headDashboard()}

        
        <div className='px-10 py-7'>
            <div className='grid grid-cols-2 items-center mb-10'>
                <div>
                    <h1 className='font-bold mb-5'>List Musik</h1>
                </div>
                <div className='text-right'>
                    <button className='text-sm font-bold hover:text-gold rounded-lg text-white  hover:bg-white hover:border hover:border-gold transition-all bg-gold px-4 py-2'>Tambah Lagu</button>
                </div>
            </div>

            <div className='px-10 py-5 border border-gold mb-8 rounded-xl'>
                <h2 className='font-bold mb-8'>Upload Lagu Baru</h2>

                <form action="">
                    <input type="file" id="upload" className='mb-8' onChange={handleFiles} />
                    <audio id="audio" controls className='mb-8'>
                        <source src={audioSrc} id="src" type='audio'/>
                        Your browser does not support the audio element.
                    </audio>

                    <button className='text-sm font-bold hover:text-gold rounded-lg text-white  hover:bg-white hover:border hover:border-gold transition-all bg-gold px-4 py-2'>Upload Lagu</button>
                </form>
                
            </div>

          <Table aria-label="Example table with custom cells">
      <TableHeader columns={songs}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={song}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey,item.id)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
      </div>
    </section>
     <ToastContainer></ToastContainer>
     </>
  )
}