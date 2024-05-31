import React, { useState } from 'react'

const Conversations = (props) => {
    const { conversation, isSelected, setSelectedConversation } = props

    // const ring = `https://api.dicebear.com/8.x/rings/svg?seed=${conversation.username}`
    const neutral = `https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=${conversation.fullname}`
    // const id = `https://api.dicebear.com/8.x/identicon/svg?seed=${conversation.username}`
    // const emoji = `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${conversation.username}`

    return (
        <div onClick={() => setSelectedConversation(conversation)}>
            <div
                className={
                    `w-full flex items-center p-2 hover:bg-ocean active:bg-lightsky` +
                    (isSelected ? ' bg-lightsky ' : '')
                }
            >
                <div className=' w-10 border-2 border-midnight rounded-full'>
                    <img
                        className='w-full rounded-full'
                        // src={`https://avatar.iran.liara.run/username?username=${conversation.username}`}
                        src={neutral}
                    />
                </div>
                <div className=' p-3 text-sm'>{conversation.fullname}</div>
                <div className=' ml-auto'></div>
            </div>
            <hr className='border border-midnight' />
        </div>
    )
}

export default Conversations
