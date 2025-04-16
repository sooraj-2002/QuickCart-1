import { Inngest } from "inngest";
// import { connect } from "mongoose";
import connectDB from "./db"
import User from "@/model/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//Inngest Function to save user data to a database 
export const syncUserCreation = inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    },
    {  event:'clerk/user.created'},
    async({event})=>{
        // Save the user data to a database
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            _id : id,
            email : email_addresses[0].email_address,
            name : first_name + " " + last_name,
            image_url : image_url
        }    
        // Save the user data to a database
        await connectDB()
        await User.create(userData)
    }
)

// Inngest Function to update user data in a database
export const syncUserUpdation = inngest.createFunction(
    {
        id:'update-user-from-clerk',
    },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        // Update the user data in a database
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        const userData = {
            _id : id,
            email : email_addresses[0].email_address,
            name : first_name + " " + last_name,
            image_url : image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id,userData)    
    }
)

// Inngest Function to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk',
        },
        { event: 'clerk/user.deleted' },
        async ({ event }) => {
            // Delete the user data from a database
            const { id } = event.data
            
            await connectDB()
            await User.findByIdAndDelete(id)
        }
    
)