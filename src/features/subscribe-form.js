import React, { useState } from 'react'

const ENDPOINT = 'https://app.convertkit.com/forms/2890689/subscriptions'

const StatusText = ({ for: status }) => {
  switch (status) {
    case 'success':
      return (
        <p>
          Thanks! You should receive an email, please confirm your subscription
          there
        </p>
      )

    case 'failure':
      return (
        <p>An error occured, please check your devtools and contact me xD</p>
      )

    default:
      return null
  }
}

export const SubscribeForm = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('initial')

  const handleSubmit = async event => {
    event.preventDefault()

    const body = new FormData()
    body.set('email_address', email)

    try {
      const response = await fetch(ENDPOINT, {
        method: 'post',
        body,
        headers: {
          accept: 'application/json',
        },
      })

      const json = await response.json()

      if (json.status !== 'success') {
        throw new Error('Unknown error')
      }

      setStatus('success')
      setEmail('')
    } catch {
      setStatus('failure')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input value={email} onChange={setEmail} />
        <button type="submit">Subscribe</button>
      </div>
      <StatusText for={status} />
    </form>
  )
}
