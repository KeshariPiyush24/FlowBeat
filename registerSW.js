if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/FlowBeat/sw.js', { scope: '/FlowBeat/' })})}