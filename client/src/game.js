let ws = null;

function connect() {
    let ws = new WebSocket("ws://localhost:8000/ws/connect");
    ws.onopen = function() {}
    ws.onmessage = function(evt) {
        let received_msg = evt.data;
    }
    ws.onclose = function() {}

    return ws
}

export function NewGame() {

}

export function JoinGame() {

}

export function Init() {
    const url = new URL(window.location.href);
    const game = url.searchParams.get("game");

    if (url === "") {
        console.log("?game= parameter not detected.")
    }
}