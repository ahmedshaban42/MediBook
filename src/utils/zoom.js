import axios from 'axios';
import qs from 'qs'


// 1. توليد Access Token من Zoom Server-to-Server OAuth
export const getZoomAccessToken=async()=>{
    const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;
    const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(tokenUrl, null, {
    headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    });

    return response.data.access_token;
}

// 2. إنشاء اجتماع جديد
export const createZoomMeeting=async ({ topic, start_time, duration })=>{
    const accessToken = await getZoomAccessToken();

    const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
        topic,
        type: 2,
        start_time, // لازم يكون بتنسيق ISO وبتوقيت UTC
        duration,
        timezone: 'Africa/Cairo',
        settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            },
        },
        {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        }
    );
    console.log(response.data)
    return response.data; // يحتوي على join_url، meeting ID، وغيرها
}
