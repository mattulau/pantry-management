'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, query, doc, getDocs, deleteDoc, setDoc, getDoc, where, and } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  let queryList = []

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []

    console.log(queryList)

    docs.forEach((doc) => {
      if(queryList.length == 0 || queryList.includes(doc.id))
        inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()   
      await setDoc(docRef, {name: item, quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {name: item, quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity} = docSnap.data() 
      if (quantity == 1){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {name: item, quantity: quantity - 1})
      }
    }
    await updateInventory()
  }
  
  const handleFilter = async (search) => {
    const docRef = collection(firestore, 'inventory')
    const q = query(docRef, and(where('name', '>=', search.toLowerCase()), where('name', '<=', search.toLowerCase() + '\uf8ff')))
    const results = await getDocs(q)

    let newQueryList = []
    results.docs.forEach((item) => {
      newQueryList.push(item.id)
    })
    queryList = newQueryList;
    await updateInventory()
  }


  useEffect(() => {
    handleFilter('')
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      bgcolor="#e0f2f1"
      >
          <form>
            <input name="search" placeholder="Search" onChange={e => handleFilter(e.target.value)}/>
          </form>
        <Modal open={open} onClose={handleClose}>
          
          <Box
            position="absolute" 
            top="50%" 
            left="50%" 
            width={400} 
            bgcolor="white" 
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%,-50%)",
            }}
          >
            <Typography variant="h6"> Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
              />
              <Button variant="outlined" onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}>
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button 
          variant="contained"
          onClick={() => {
            handleOpen()
          }}>
            ADD NEW ITEM
        </Button>
        <Box border="1px solid #333">
          <Box 
            width="800px" 
            height="100px" 
            bgcolor="#ADD8E6"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" color="#333">
              Pantry Items
            </Typography>
          </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            inventory.map(({name, quantity})=> (
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                bgcolor="#e0f2f1"
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}  
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}  
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained"
                    onClick={() => {
                      addItem(name)
                    }}
                  >
                    Add
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      removeItem(name)
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
    </Box>
  )}