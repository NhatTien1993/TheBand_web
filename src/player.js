/**
 * Các bước làm:
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/ pause/ seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAY_STORAGE_KEY = 'N_player'
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const btnTogglePlay = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');

// console.log(iconPause, iconPlay, btnTogglePlay)
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {}, // Lấy cấu hình đã lữu trên storage và đọc ra JS
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "./assets/music/musicTest.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: " ./assets/music/musicTest.mp3",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
                " ./assets/music/musicTest.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: " ./assets/music/musicTest.mp3",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: " ./assets/music/musicTest.mp3",
            image:
                "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
                " ./assets/music/musicTest.mp3",
            image:
                "https://i.ytimg.com/vi/gwHOq8b_q8E/maxresdefault.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: " ./assets/music/musicTest.mp3",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],
    // Hàm lấy cấu hình và set rồi lưu lên storage
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config))
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
        <div class="song ${this.currentIndex === index ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        }).join('');
        playlist.innerHTML = htmls
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent() {
        const isPlaying = false
        const cdWidth = cd.offsetWidth
        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds cho 1 chu kỳ
            iterations: Infinity // sự lặp lại ( vô cực)
        })
        cdThumbAnimate.pause()
        // Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        };
        // Xử lý khi click play/ pause
        btnTogglePlay.onclick = () => {

            if (this.isPlaying) {
                audio.pause()
            } else {
                audio.play();
            }
        };
        audio.onplay = () => { // lắng nghe khi audio thưc sự play
            this.isPlaying = true
            player.classList.add('playing');
            cdThumbAnimate.play();
        };
        audio.onpause = () => { // lắng nghe khi audio thưc sự pause
            this.isPlaying = false
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }
        // Xử lý khi tua bài hát
        progress.onchange = (e) => {
            const progressCurrentValue = e.target.value
            audio.currentTime = (progressCurrentValue * audio.duration) / 100

        }
        // Xử lý thanh range chạy theo bài hát
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercents = (audio.currentTime / audio.duration) * 100
                progress.value = progressPercents
            }
        }
        // Xử lý repeat và Next ended song
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        }
        // Xử lý NextSong
        btnNext.onclick = () => {
            this.nextSong();
            audio.play();
            this.render();
            this.scrollViewActiveSong();
        }
        // Xử lý PrevSong
        btnPrev.onclick = () => {
            this.prevSong();
            audio.play();
            this.render();
            this.scrollViewActiveSong();

        }
        // Xử lý nextSong random khi bấm vào icon random
        btnRandom.onclick = () => {
            this.isRandom = !this.isRandom;
            this.setConfig('isRandom', this.isRandom); // đọc key và lưu cấu hình để lưu
            btnRandom.classList.toggle('active', this.isRandom);

        }
        // Xử lý lặp lại 1 bài hát khi bấm nút repeat
        btnRepeat.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.setConfig('isRepeat', this.isRepeat); // đọc key và lưu cấu hình để lưu
            btnRepeat.classList.toggle('active', this.isRepeat);

        }
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode && !e.target.closest('.option')) {
                this.currentIndex = Number(songNode.dataset.index);
                this.loadCurrentSong();
                this.render();
                audio.play();
            }
        }
    },
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong() {
        if (this.isRandom) {
            this.randomSong();
        } else {
            this.currentIndex++;
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
        }
        this.loadCurrentSong();
    },
    prevSong() {
        if (this.isRandom) {
            this.randomSong();
        } else {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1;
            }
        }
        this.loadCurrentSong();
    },
    randomSong() {
        let indexRandom = Math.floor(Math.random() * this.songs.length)
        do {
            indexRandom = Math.floor(Math.random() * this.songs.length)
        } while (indexRandom === this.currentIndex);
        this.currentIndex = indexRandom;
    },
    repeatSong() {
        if (this.isRepeat) {
            this.currentIndex = this.currentIndex;
        }
    },
    scrollViewActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 200)
    },
    start() {
        // Load lại cấu hình đã lữu 
        this.loadConfig();
        // Lưu css cho cấu hình ban đầu

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe/ xử lý các sự kiện ( DOM event)
        this.handleEvent();

        // Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render ra HTML
        this.render();

        btnRandom.classList.toggle('active', this.isRandom);
        btnRepeat.classList.toggle('active', this.isRepeat);
    }
}

app.start()