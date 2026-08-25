<template>
    <main class="container py-4">

        <div class="d-flex align-items-center gap-2 mb-3">
            <router-link to="/" class="btn btn-outline-secondary bg-light" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <h3 class="mb-0 nwroman">Vocabulary Wheel</h3>
        </div>

        <div class="card mx-auto" style="max-width: 900px;">
            <div class="card-body text-center">
                <!-- REMAINING + HISTORY BUTTON -->
                <p class="text-muted mb-2 d-flex justify-content-center align-items-center gap-2 flex-wrap">
                    <span>Remaining: <strong>{{ remainingItems.length }}</strong></span>
                    <span v-if="selectedItems.length > 0">|</span>
                    <button v-if="selectedItems.length > 0" class="btn btn-sm btn-outline-dark rounded-pill"
                        @click="showHistory = true">
                        <i class="bi bi-clock-history me-1"></i>Sequence ({{ selectedItems.length }})
                    </button>
                </p>

                <div class="wheel-container" :style="{ width: wheelSize + 'px', height: wheelSize + 'px' }">
                    <div class="pointer">▼</div>
                    <div class="wheel" :style="wheelStyle">
                        <div v-for="(item, index) in remainingItems" :key="item.id || index" class="wheel-label-outer"
                            :style="getLabelStyle(index)">
                            <span class="label-text-outer">{{ item.meaning }}</span>
                        </div>
                        <!-- CENTER IS THE BUTTON NOW -->
                        <button class="wheel-center text-dark" :disabled="isSpinning || remainingItems.length === 0"
                            @click="spinWheel">
                            <span v-if="!isSpinning">SPIN</span>
                            <span v-else class="spin-icon">...</span>
                        </button>
                    </div>
                </div>

                <div v-if="remainingItems.length === 0 && !isSpinning" class="mt-4">
                    <h4 class="text-success">🎉 Finished!</h4>
                    <p>All vocabulary items have been used.</p>
                    <button class="btn btn-outline-dark rounded-pill mt-2" @click="showHistory = true">
                        <i class="bi bi-list-ol me-1"></i>View Full Sequence
                    </button>
                </div>
            </div>
        </div>

        <!-- QUESTION POPUP -->
        <transition name="pop">
            <div v-if="showPopup && currentItem" class="popup-overlay" @click.self="closePopup">
                <div class="popup-card">
                    <button class="popup-close" @click="closePopup">×</button>
                    <div class="popup-badge">#{{ selectedItems.length }} / {{ selectedItems.length +
                        remainingItems.length }}</div>

                    <div v-if="currentItem.kanji" class="popup-kanji mt-3">
                        <span class="popup-kana-label">Kanji</span>
                        <span class="popup-kanji-text">{{ currentItem.kanji }}</span>
                    </div>
                    <div class="popup-divider"></div>
                    <div class="popup-kana">
                        <span class="popup-kana-label">Meaning</span>
                        <span class="popup-kana-text japanese text-capitalize">{{ currentItem.meaning }}</span>
                    </div>
                    <div class="popup-hint">✏ Write the Kana</div>
                    <button class="btn btn-primary btn-lg w-100 mt-3" @click="closePopup">
                        Continue <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
            </div>
        </transition>

        <!-- SEQUENCE HISTORY POPUP - DOES NOT RESET WHEEL -->
        <transition name="pop">
            <div v-if="showHistory" class="popup-overlay" @click.self="showHistory = false">
                <div class="popup-card"
                    style="width: min(94vw, 500px); max-height: 85vh; display:flex; flex-direction:column; text-align:left;">
                    <button class="popup-close" @click="showHistory = false">×</button>
                    <h5 class="fw-bold mb-1 text-center">Selected Sequence</h5>
                    <p class="text-muted small mb-3 text-center">{{ selectedItems.length }} items so far — wheel
                        continues</p>

                    <div style="overflow-y:auto; flex:1; border:1px solid #eee; border-radius:12px;">
                        <div v-for="(item, i) in selectedItems" :key="i"
                            class="d-flex align-items-center gap-2 p-2 border-bottom"
                            :class="{ 'bg-light': currentItem && currentItem === item }">
                            <div class="fw-bold text-muted text-center" style="width:28px;">{{ i + 1 }}</div>
                            <div class="japanese fw-bold" style="min-width:70px; font-size:1.2rem;">{{ item.kanji }}</div>
                            <div class="flex-grow-1">
                                <div class="small fw-semibold text-capitalize">{{ item.meaning }}</div>
                            </div>
                            <div v-if="currentItem && currentItem === item" class="badge bg-primary">now</div>
                        </div>
                        <div v-if="selectedItems.length === 0" class="p-4 text-center text-muted">No picks yet</div>
                    </div>

                    <button class="btn btn-dark w-100 mt-3" @click="showHistory = false">
                        Back to Wheel
                    </button>
                </div>
            </div>
        </transition>

        <!-- FINAL REVIEW TABLE -->
        <div v-if="selectedItems.length > 0 && remainingItems.length === 0 && !isSpinning" class="card mx-auto mt-4"
            style="max-width: 900px;">
            <div class="card-header text-center fw-bold">Review Sequence</div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-bordered mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="text-center">#</th>
                                <th class="text-center">Kanji</th>
                                <th>Meaning</th>
                                <th class="text-center">Kana</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in selectedItems" :key="index">
                                <td class="text-center fw-bold">{{ index + 1 }}</td>
                                <td class="text-center japanese fw-bold">{{ item.kanji }}</td>
                                <td>{{ item.meaning }}</td>
                                <td class="text-center japanese">{{ item.kana }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { book1Vocabulary, book2Vocabulary } from '../data/data'

const route = useRoute()
const numQuestions = computed(() => Number(route.query.items) || 10)
const lessonStart = computed(() => Number(route.query.start) || 1)
const lessonEnd = computed(() => Number(route.query.end) || lessonStart.value)
const allVocabulary = computed(() => [...book1Vocabulary, ...book2Vocabulary])

const remainingItems = ref([])
const selectedItems = ref([])
const currentItem = ref(null)
const rotation = ref(0)
const isSpinning = ref(false)
const showPopup = ref(false)
const showHistory = ref(false)
const wheelSize = ref(600)

const updateWheelSize = () => {
    const vw = window.innerWidth
    if (vw < 380) wheelSize.value = Math.floor(vw * 0.88)
    else if (vw < 576) wheelSize.value = Math.floor(vw * 0.85)
    else if (vw < 768) wheelSize.value = Math.floor(vw * 0.70)
    else wheelSize.value = 600
}

const wheelColors = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#38d9a9', '#4dabf7', '#748ffc', '#9775fa', '#da77f2', '#f783ac']

const generateVocabulary = () => {
    const available = allVocabulary.value.filter(i => i.lesson >= lessonStart.value && i.lesson <= lessonEnd.value)
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    remainingItems.value = shuffled.slice(0, Math.min(numQuestions.value, shuffled.length))
    selectedItems.value = []
    currentItem.value = null
    rotation.value = 0
    showPopup.value = false
    showHistory.value = false
}

const wheelStyle = computed(() => {
    const count = remainingItems.value.length
    if (!count) return { transform: `rotate(${rotation.value}deg)`, background: '#f8f9fa' }
    const segment = 360 / count
    const slices = remainingItems.value.map((_, i) => {
        const c = wheelColors[i % wheelColors.length]
        return `${c} ${i * segment}deg ${(i + 1) * segment}deg`
    })
    return { transform: `rotate(${rotation.value}deg)`, background: `conic-gradient(${slices.join(', ')})` }
})

const getLabelStyle = (index) => {
    const count = remainingItems.value.length
    if (!count) return {}
    const segment = 360 / count
    const angle = index * segment + segment / 2
    const height = wheelSize.value / 2 - 8
    return { height: `${height}px`, transform: `translateX(-50%) rotate(${angle}deg)` }
}

const closePopup = () => { showPopup.value = false }

const spinWheel = () => {
    if (isSpinning.value || !remainingItems.value.length) return
    isSpinning.value = true
    currentItem.value = null
    showPopup.value = false

    const count = remainingItems.value.length
    const selectedIndex = Math.floor(Math.random() * count)
    const segment = 360 / count
    const localCenter = selectedIndex * segment + segment / 2
    const currentMod = rotation.value % 360
    const desiredMod = (360 - localCenter) % 360
    let delta = desiredMod - currentMod
    if (delta < 0) delta += 360
    const extraSpins = 360 * 5
    rotation.value += delta + extraSpins

    setTimeout(() => {
        const selected = remainingItems.value[selectedIndex]
        selectedItems.value.push(selected)
        currentItem.value = selected
        remainingItems.value.splice(selectedIndex, 1)
        isSpinning.value = false
        showPopup.value = true
        if (navigator.vibrate) navigator.vibrate(80)
    }, 5000)
}

onMounted(() => {
    updateWheelSize()
    window.addEventListener('resize', updateWheelSize)
    generateVocabulary()
})
onUnmounted(() => window.removeEventListener('resize', updateWheelSize))
</script>

<style scoped>
.wheel-container {
    position: relative;
    margin: 20px auto;
    width: min(90vw, 600px);
    height: min(90vw, 600px);
    max-width: 90vw;
}

.pointer {
    position: absolute;
    top: -22px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    font-size: 40px;
    color: #dc3545;
    line-height: 1;
}

.wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 8px solid #343a40;
    position: relative;
    overflow: hidden;
    transition: transform 5s cubic-bezier(0.15, 0.8, 0.25, 1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
}

.wheel-label-outer {
    position: absolute;
    left: 50%;
    top: 0;
    width: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    transform-origin: bottom center;
    pointer-events: none;
    z-index: 2;
}

.label-text-outer {
    position: absolute;
    top: 18px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-family: 'NotoSerifJP', serif;
    font-weight: bold;
    color: #212529;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9);
    font-size: clamp(0.7rem, 2vw, 0.95rem);
    line-height: 1;
    white-space: nowrap;
    max-height: 85%;
    overflow: hidden;
}

.wheel-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: white;
    border: 6px solid #343a40;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    font-size: 1.1rem;
    z-index: 10;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), 0 0 0 4px white;
    cursor: pointer;
    transition: transform 0.15s;
    -webkit-tap-highlight-color: transparent;
}

.wheel-center:active:not(:disabled) {
    transform: translate(-50%, -50%) scale(0.92);
}

.wheel-center:disabled {
    cursor: not-allowed;
    opacity: 0.9;
}

.japanese {
    font-family: 'NotoSerifJP', serif;
}

.spin-icon {
    display: inline-block;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.nwroman {
    font-family: 'NotoSerifJP', Times, serif;
    color: #f7f5f5;
    text-shadow: #0f0f0f 1px 1px, #0a0a0a 2px 2px;
}

/* POPUPS */
.popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: max(16px, env(safe-area-inset-bottom));
}

.popup-card {
    position: relative;
    background: white;
    width: min(92vw, 420px);
    border-radius: 20px;
    padding: 28px 24px 20px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.popup-close {
    position: absolute;
    top: 10px;
    right: 14px;
    border: none;
    background: #f1f3f5;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
}

.popup-badge {
    display: inline-block;
    background: #f1f3f5;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    color: #868e96;
    margin-bottom: 10px;
}

.popup-kanji {
    font-size: clamp(2.2rem, 10vw, 3.2rem);
    font-family: 'NotoSerifJP', serif;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 6px;
}

.popup-kana {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 12px;
}

.popup-kana-label {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #868e96;
    margin-bottom: 4px;
}

.popup-kana-text {
    font-size: 1.6rem;
    font-weight: bold;
}

.popup-kanji-text {
    font-size: clamp(2.2rem, 10vw, 3.2rem);
    font-family: 'NotoSerifJP', serif;
    font-weight: 800;
}

.popup-divider {
    height: 1px;
    background: #e9ecef;
    margin: 18px 0;
}

.popup-hint {
    margin-top: 14px;
    font-size: 0.85rem;
    color: #868e96;
}

.pop-enter-active {
    animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-leave-active {
    animation: popIn 0.2s reverse ease-in;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.85) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@media (max-width: 768px) {
    .wheel {
        border-width: 6px;
    }

    .label-text-outer {
        top: 10px;
        font-size: clamp(0.6rem, 2.8vw, 0.85rem);
    }

    .wheel-center {
        width: 19vw;
        height: 19vw;
        max-width: 85px;
        max-height: 85px;
        border-width: 4px;
        font-size: 0.9rem;
    }
}
</style>