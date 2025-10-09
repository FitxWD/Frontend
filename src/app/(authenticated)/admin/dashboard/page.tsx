"use client"
import { useAuth } from '@/contexts/AuthContext'
import React, { useEffect } from 'react'

const AdminDashboard = () => {
    const {user} = useAuth();
    useEffect(() => {
        const printToken = async () => {
            const token = await user?.getIdToken();
            console.log(token);
        }
        if (user) {
            printToken();
        }
    }, [user])

  return (
    <div>Admin Dashboard</div>
  )
}

export default AdminDashboard