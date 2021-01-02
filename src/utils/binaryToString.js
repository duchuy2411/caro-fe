//convert binary to string
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

export default function convertAvatarPropToString(avatar) {
    if (!avatar)
        return '/img/user-icon.jpg';
    return 'data:image/png;base64,' + arrayBufferToBase64(avatar.data.data);
}