import React, { useEffect, useCallback, useState } from 'react';
import ReactPlayer from 'react-player';
import peer from '../service/peer';
import { useSocket } from '../context/SocketProvider';

const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setrRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined the room`);
        setrRemoteSocketId(id)
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer})
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncomingCall = useCallback(({from , offer}) => {
        console.log(`Incoming Call`, from , offer);
    }, [])

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on('incoming:call', handleIncomingCall)

        return () => {
            socket.off('user:joined', handleUserJoined);
            socket.off('incoming:call', handleIncomingCall);

        }
    }, [socket, handleUserJoined, handleIncomingCall]);
    return (
        <div>
            <h1>
                Room Page
            </h1>
            <h4>{remoteSocketId ? 'Connected' : 'No one in room'}</h4>
            {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
            {myStream &&
                <>
                    <h1>My Stream</h1>
                    <ReactPlayer playing muted height="100px" width="200px" url={myStream} />
                </>
            }
        </div>

    )
}

export default RoomPage;