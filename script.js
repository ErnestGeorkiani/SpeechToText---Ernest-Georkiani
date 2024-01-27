document.getElementById('click_to_convert').addEventListener('click', function () {

    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;

    if (!window.SpeechRecognition) {
        alert('Speech recognition not supported on your browser. Please use Chrome.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.lang = 'ka-GE';

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join(' ');

        console.log('Transcript:', transcript);

        // Use 'value' instead of 'innerHTML'
        document.getElementById('convert_text').value = transcript;
    });

    recognition.addEventListener('error', e => {
        console.error('Speech recognition error:', e.error);
    });

    recognition.addEventListener('end', () => {
        console.log('Speech recognition ended.');
    });

    if (speech == true) {
        recognition.start();
    }
});