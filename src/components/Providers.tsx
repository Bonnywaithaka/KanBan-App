'use client';
import React from 'react'
import {ApolloClient,InMemoryCache,ApolloProvider} from '@apollo/client';

function Providers({children}:{children:React.ReactNode}) {
const client =new ApolloClient({
cache:new InMemoryCache(),
 uri:"http://localhost:4000/graphql"
})
return (
<ApolloProvider client={client}>
{children}
</ApolloProvider>
  )
}

export default Providers