import React from 'react'

const Message = (props) => {
    const { message, authUser } = props
    const createdAtTime = new Date(message.createdAt).toLocaleTimeString()
    const createdAtDate = new Date(message.createdAt).toLocaleDateString();

    return (
        <div
            className={
                `w-fit max-w-[80%] bg-ocean p-2 my-1 rounded-lg ` +
                (authUser._id === message.senderId ? ' ml-auto' : '')
            }
        >
            <div className='text-midnight text-sm selection:bg-midnight selection:text-lightsky'>
                {message.message}
            </div>
            <div>
                <span className='text-xs text-lightsky p-1 selection:bg-midnight selection:text-lightsky'>
                    {createdAtTime}
                </span>
                <span className='text-xs text-midnight p-1 selection:bg-midnight selection:text-lightsky'>
                    {createdAtDate}
                </span>
            </div>
        </div>
    )
}

export default Message
