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
                <p class="text-muted mb-2">Remaining: <strong>{{ remainingItems.length }}</strong></p>

                <div class="wheel-container" :style="{ width: wheelSize + 'px', height: wheelSize + 'px' }">
                    <div class="pointer">▼</div>

                    <div class="wheel" :style="wheelStyle">
                        <!-- OUTER -> CENTER LABELS -->
                        <div v-for="(item, index) in remainingItems" :key="item.id || index" class="wheel-label-outer"
                            :style="getLabelStyle(index)">
                            <span class="label-text-outer">{{ item.meaning }}</span>
                        </div>

                        <div class="wheel-center">
                            <span v-if="!isSpinning">SPIN</span>
                            <span v-else>...</span>
                        </div>
                    </div>
                </div>

                <div v-if="currentItem" class="result-box mt-4">
                    <div class="result-number">#{{ selectedItems.length }}</div>
                    <div class="result-kanji">{{ currentItem.kanji || currentItem.kana }}</div>
                    <div class="result-meaning">{{ currentItem.meaning }}</div>
                    <div class="result-hint">✏ Write the Kana</div>
                </div>

                <button v-if="remainingItems.length > 0" class="btn btn-primary btn-lg mt-4 px-5" :disabled="isSpinning"
                    @click="spinWheel">
                    <i class="bi" :class="isSpinning ? 'bi-arrow-repeat spin-icon' : 'bi-play-fill'"></i>
                    {{ isSpinning ? 'Spinning...' : 'SPIN' }}
                </button>

                <div v-if="remainingItems.length === 0 && !isSpinning" class="mt-4">
                    <h4 class="text-success">🎉 Finished!</h4>
                    <p>All vocabulary items have been used.</p>
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
    const available = allVocabulary.value.filter(item => item.lesson >= lessonStart.value && item.lesson <= lessonEnd.value)
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    remainingItems.value = shuffled.slice(0, Math.min(numQuestions.value, shuffled.length))
    selectedItems.value = []
    currentItem.value = null
    rotation.value = 0
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

// === OUTER -> CENTER ===
const getLabelStyle = (index) => {
    const count = remainingItems.value.length
    if (!count) return {}
    const segment = 360 / count
    const angle = index * segment + segment / 2

    // This is the key: height = from edge to center
    const height = wheelSize.value / 2 - 8 // 8px padding from edge

    // Flip to keep readable: right side = 90deg, left side = -90deg
    const isLeft = angle > 90 && angle < 270

    return {
        height: `${height}px`,
        transform: `translateX(-50%) rotate(${angle}deg)`,
        // we rotate text inside, not the container
    }
}

const spinWheel = () => {
    if (isSpinning.value || !remainingItems.value.length) return
    isSpinning.value = true
    currentItem.value = null
    const count = remainingItems.value.length
    const selectedIndex = Math.floor(Math.random() * count)
    const segment = 360 / count
    const targetAngle = 360 - (selectedIndex * segment + segment / 2)
    rotation.value += 360 * 5 + targetAngle
    setTimeout(() => {
        selectedItems.value.push(remainingItems.value[selectedIndex])
        currentItem.value = remainingItems.value[selectedIndex]
        remainingItems.value.splice(selectedIndex, 1)
        isSpinning.value = false
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

/* === NEW OUTER -> CENTER LABEL === */
.wheel-label-outer {
    position: absolute;
    left: 50%;
    top: 0;
    width: 0;
    /* thin spoke */
    display: flex;
    justify-content: center;
    align-items: flex-start;
    /* STARTS AT OUTER EDGE */
    transform-origin: bottom center;
    /* rotates around center of wheel */
    pointer-events: none;
    z-index: 2;
}

.label-text-outer {
    position: absolute;
    top: 18px;
    /* distance from outer edge */
    /* This makes text flow from outer -> center */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    /* so it reads top -> bottom = outer -> inner */

    font-family: 'NotoSerifJP', serif;
    font-weight: bold;
    color: #212529;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9);
    font-size: clamp(0.7rem, 2vw, 0.95rem);
    line-height: 1;
    white-space: nowrap;
    letter-spacing: 0.5px;

    max-height: 85%;
    /* don't go all the way to center */
    overflow: hidden;
    text-overflow: ellipsis;
}

.wheel-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 85px;
    height: 85px;
    border-radius: 50%;
    background: white;
    border: 6px solid #343a40;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    z-index: 10;
}

.result-box {
    border: 1px solid #dee2e6;
    border-radius: 10px;
    padding: 20px;
    background: #f8f9fa;
}

.result-kanji {
    font-size: 2.5rem;
    font-family: 'NotoSerifJP', serif;
    font-weight: bold;
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

@media (max-width: 768px) {
    .wheel {
        border-width: 6px;
    }

    .label-text-outer {
        top: 10px;
        font-size: clamp(0.6rem, 2.8vw, 0.85rem);
    }
}
</style>