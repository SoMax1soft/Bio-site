document.addEventListener('DOMContentLoaded', () => {
    // Инициализация переменных для элементов
    const elements = {
        seekBar: document.getElementById('seek-bar'),
        playPauseBtn: document.getElementById('play-pause'),
        prevSongBtn: document.getElementById('prev-song'),
        nextSongBtn: document.getElementById('next-song'),
        muteBtn: document.getElementById('mute'),
        songTitle: document.getElementById('song-title'),
        container: document.querySelector('.container'),
        typewriterElement: document.getElementById('typewriter-text')
    };

    const container = document.querySelector('.container');

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
    
        const mouseX = event.clientX;
        const mouseY = event.clientY;
    
        const deltaX = (mouseX - centerX) / rect.width;
        const deltaY = (mouseY - centerY) / rect.height;
    
        const rotationX = deltaY * 20; // Угол наклона по оси X увеличен до 20 градусов
        const rotationY = deltaX * -20; // Угол наклона по оси Y увеличен до -20 градусов
    
        container.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    });
    
    container.addEventListener('mouseleave', () => {
        // Сброс поворота при уходе курсора с контейнера с плавной анимацией
        container.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
    
    const missingElements = [];

    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            missingElements.push(key);
        }
    }

    if (missingElements.length > 0) {
        console.error('Один или несколько элементов управления не найдены:', missingElements.join(', '));
        return; // Прекращаем выполнение, если какой-то элемент отсутствует
    }

    // Инициализация плеера и элементов управления
    const audioPlayer = document.createElement('audio');
    document.body.appendChild(audioPlayer); // Вставляем аудио элемент в DOM

    // Массив с песнями и названиями
    let songs = [
        { src: 'music/fortuna.mp3', title: 'Fortuna 812 - Trytofriend' },
        { src: 'music/Song 404 speed up.mp3', title: 'Время истекло - Song 404 speed up' },
        { src: 'music/Suka.mp3', title: 'Kristiee Ft Mapt0V Suka' },
        { src: 'music/booker-gde-papa.mp3', title: 'GDE PAPA?' },
        { src: 'music/xdree.mp3', title: 'Xdree - Потеряла голову' },
        { src: 'music/syava.mp3', title: 'Сява – Меня вставляет дым' },
        { src: 'music/akashi2.mp3', title: 'Dabbackwood - Сейджуро акаши 2' },
        { src: 'music/5opkasiski.mp3', title: '5opka - Сиськи' },
        { src: 'music/tox-nik.mp3', title: 'Toxi$ - НИКОГДАБЫ (Remix)' },
        { src: 'music/voskresenski-neupt.mp3', title: 'Voskresenskii, Wipo - Я не употребляю' },
        { src: 'music/TOLPI.mp3', title: 'Uniqe, Nkeeei, Artem Shilovets - Толпы Кричат' },
        { src: 'music/100л.mp3', title: 'НАВЕРНОЕ ПОЭТ, ЯКОРЪ, EVEN CUTE - 100К' },
        { src: 'music/Baby Melo - Slappy Tap.mp3', title: 'Baby Melo - Slappy Tap' },
        { src: 'music/scalivampik.mp3', title: 'Scally Milano, uglystephan - Вампир' },
        { src: 'music/srediti.mp3', title: 'SunThugga, Delle - Среди тысяч' },
        { src: 'music/dawgs.mp3', title: 'Hanumankind' }
    ];
    let currentSongIndex = 0;

    function loadSong(index) {
        if (songs[index]) {
            audioPlayer.src = songs[index].src;
            elements.songTitle.textContent = `${songs[index].title}`;
            audioPlayer.play();
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function playPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            elements.playPauseBtn.querySelector('img').src = 'player-icons/pause-button.png'; // Изменение иконки на паузу
        } else {
            audioPlayer.pause();
            elements.playPauseBtn.querySelector('img').src = 'player-icons/play-button.png'; // Изменение иконки на воспроизведение
        }
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    }

    function updateTrackInfo() {
        const currentTime = formatTime(audioPlayer.currentTime);
        const duration = formatTime(audioPlayer.duration);
        document.getElementById('current-time').textContent = currentTime;
        document.getElementById('duration').textContent = duration;
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    }

    function updateSeekBar() {
        if (elements.seekBar && audioPlayer.duration) {
            elements.seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        }
    }

    function changeSeekBar() {
        if (elements.seekBar) {
            audioPlayer.currentTime = (elements.seekBar.value / 100) * audioPlayer.duration;
        }
    }

    function updateVolume() {
        if (audioPlayer.volume === 0) {
            elements.muteBtn.querySelector('img').src = 'player-icons/mute-icon.png'; // Иконка для mute
        } else {
            elements.muteBtn.querySelector('img').src = 'player-icons/speaker-icon.png'; // Иконка для громкости
        }
    }

    function toggleMute() {
        if (audioPlayer.volume === 0) {
            audioPlayer.volume = 1; // Восстанавливаем громкость до 100%
            elements.muteBtn.querySelector('img').src = 'player-icons/speaker-icon.png'; // Иконка для громкости
        } else {
            audioPlayer.volume = 0;
            elements.muteBtn.querySelector('img').src = 'player-icons/mute-icon.png'; // Иконка для mute
        }
    }

    // Тайпинг текста
    const texts = [
        "Hello, I am Max1soft ",
        "Welcome to my Page!",
        "My stack is Java & Js.",
        "Start learning SQL",
        "Do you like Java?",
        "Just Chill",
        "I like this music.",
        "🫵🤡",
        "101010101010101",
        "I'm using java 2 years.",
        "Subscribe to my Telegram!",
        "Fuck the laws!",
        "Good Design?",
        "Best of the Best!",
        "Minecraft Coder",
        "🤔",
        "I'm 16 y.o."
    ];

    let index = 0;
    let charIndex = 0;
    let currentText = '';
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseBetween = 2000;

    function type() {
        if (!elements.typewriterElement) return;

        currentText = texts[index];
        if (isDeleting) {
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                setTimeout(type, pauseBetween);
            } else {
                elements.typewriterElement.innerHTML = currentText.substring(0, charIndex);
                setTimeout(type, deleteSpeed);
            }
        } else {
            charIndex++;
            elements.typewriterElement.innerHTML = currentText.substring(0, charIndex);
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, pauseBetween);
            } else {
                setTimeout(type, typeSpeed);
            }
        }
    }

    type();

    // Инициализация при загрузке страницы
    loadSong(currentSongIndex);

    audioPlayer.addEventListener('timeupdate', () => {
        updateSeekBar();
        updateTrackInfo();
    });

    // Добавляем обработчики событий
    elements.seekBar.addEventListener('input', changeSeekBar);
    elements.playPauseBtn.addEventListener('click', playPause);
    elements.prevSongBtn.addEventListener('click', prevSong);
    elements.nextSongBtn.addEventListener('click', nextSong);
    elements.muteBtn.addEventListener('click', toggleMute);

    // Смена трека при завершении текущего
    audioPlayer.addEventListener('ended', nextSong);
});
