<template>
    <div class="hdl-time-player">
        <!-- 播放/暂停按钮 -->
        <button
            @click="togglePlay"
            class="btn">
            {{ isPlaying ? "⏸ 暂停" : "▶ 播放" }}
        </button>

        <!-- 进度条 -->
        <div class="progress-bar">
            <input
                type="range"
                :min="0"
                :max="totalSteps"
                step="1"
                v-model="currentStep"
                @input="onSliderChange"
                class="slider" />
        </div>

        <!-- 时间显示 -->
        <span class="time-label">{{ formatTime(currentTime) }}</span>

        <!-- 倍速选择 -->
        <select
            v-model="speed"
            class="speed-select">
            <option
                v-for="s in speeds"
                :key="s"
                :value="s"
                >{{ s }}x</option
            >
        </select>
    </div>
</template>

<script>
import dayjs from "dayjs";

export default {
    name: "TimePlayer",
    props: {
        startTime: {
            type: Number, // 时间戳(秒)
            required: true,
        },
        endTime: {
            type: Number, // 时间戳(秒)
            required: true,
        },
        intervalSeconds: {
            type: Number, // 播放步长，秒
            default: 1,
        },
    },
    data() {
        return {
            isPlaying: false,
            timer: null,
            currentStep: 0,
            speed: 1,
            speeds: [0.5, 1, 2, 4],
        };
    },
    computed: {
        totalSteps() {
            return Math.floor((this.endTime - this.startTime) / this.intervalSeconds);
        },
        currentTime() {
            return this.startTime + this.currentStep * this.intervalSeconds;
        },
    },
    methods: {
        formatTime(ts) {
            return dayjs.unix(ts).format("YYYY-MM-DD HH:mm:ss");
        },
        togglePlay() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        play() {
            this.isPlaying = true;
            if (this.currentStep >= this.totalSteps) {
                this.currentStep = 0;
                this.$emit("time-change", this.formatTime(this.currentTime));
            }
            this.timer = setInterval(() => {
                if (this.currentStep < this.totalSteps) {
                    this.currentStep++;
                } else {
                    this.pause();
                }
                this.$emit("time-change", this.formatTime(this.currentTime));
            }, 1000 / this.speed); // 播放间隔受倍速影响
        },
        pause() {
            this.isPlaying = false;
            clearInterval(this.timer);
            this.timer = null;
        },
        onSliderChange() {
            this.$emit("time-change", this.formatTime(this.currentTime));
        },
    },
    watch: {
        speed() {
            if (this.isPlaying) {
                this.pause();
                this.play(); // 倍速切换时重新启动
            }
        },
    },
    beforeDestroy() {
        this.pause();
    },
};
</script>

<style lang="scss" scoped>
.hdl-time-player {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8f8f8;
    padding: 10px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    .progress-bar {
        flex: 1;
        position: relative;
        .slider {
            width: 100%;
            cursor: pointer;
        }
    }
    .btn {
        padding: 4px 10px;
        cursor: pointer;
        border: 1px solid #ccc;
        background: white;
        border-radius: 4px;
    }
    .speed-select {
        padding: 4px;
        border-radius: 4px;
    }
    .time-label {
        min-width: 150px;
        text-align: center;
    }
}
</style>
