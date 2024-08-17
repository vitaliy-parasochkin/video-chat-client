## This is the client-side repository for the pet project "video-chat"

#### You can open the site by [link](https://video-chat-by-pv.vercel.app/)

### Technologies and functionality:
- 🌐 Video chat development using NextJS 14 and Typescript.
- 🤝 Implementation of real-time interaction using SocketIO.
- 🔐 User authentication with AuthJS using Google, Github and Credentials providers
- 🎥 Using PeerJS to create a WebRTC connection and transfer video and audio between users
- 💅 Beautiful design using TailwindCSS. Dark and light themes.
- 🧾 Using Prisma with MongoDB.
- 🛠️ Creating a server using Express & Typescript.
- ➕ middleware, server actions, form validation, hooks etc...

### Using locally:

- Cloning the repository
- npm i
- Configuring the .env.local file:

``` 
DATABASE_URL=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_SOCKET_SERVER_URL=
```

### Server settings
To configure the server, go to the [server](https://github.com/vitaliy-parasochkin/video-chat-server) 

### Start the application:
``` npm run dev ``` 
