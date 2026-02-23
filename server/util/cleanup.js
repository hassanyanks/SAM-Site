function clearSessions() {
    console.log('Deleting persistent sessions...');
    if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log('Sessions deleted.');
    } else {
        console.log('Sessions directory not found, no cleanup needed.');
    }
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true }); // recursive: true creates parent directories if they don't exist
    }
}

