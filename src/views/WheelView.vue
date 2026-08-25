<template>
    <main class="container py-4">

        <!-- Header -->
        <div class="d-flex align-items-center gap-2 mb-3">

            <router-link to="/" class="btn btn-outline-secondary" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>

            <h3 class="mb-0">
                Vocabulary Wheel
            </h3>

        </div>


        <!-- Wheel Area -->
        <div class="card mx-auto" style="max-width: 700px;">

            <div class="card-body text-center">

                <!-- Remaining Items -->
                <p class="text-muted mb-2">
                    Remaining:
                    <strong>{{ remainingItems.length }}</strong>
                </p>


                <!-- ================================= -->
                <!-- WHEEL -->
                <!-- ================================= -->

                <div class="wheel-container">

                    <!-- Pointer -->
                    <div class="pointer">
                        ▼
                    </div>


                    <!-- Wheel -->
                    <div class="wheel" :style="wheelStyle">

                        <!-- Text inside slices -->
                        <div v-for="(item, index) in remainingItems" :key="item.id || index" class="wheel-label"
                            :style="getLabelStyle(index)">
                            {{ item.kanji || item.kana }}
                        </div>


                        <!-- Center -->
                        <div class="wheel-center">

                            <span v-if="!isSpinning">
                                SPIN
                            </span>

                            <span v-else>
                                ...
                            </span>

                        </div>

                    </div>

                </div>


                <!-- ================================= -->
                <!-- CURRENT RESULT -->
                <!-- ================================= -->

                <div v-if="currentItem" class="result-box mt-4">

                    <div class="result-number">
                        #{{ selectedItems.length }}
                    </div>

                    <div class="result-kanji">
                        {{ currentItem.kanji || currentItem.kana }}
                    </div>

                    <div class="result-meaning">
                        {{ currentItem.meaning }}
                    </div>

                    <div class="result-hint">
                        ✏️ Write the Kana
                    </div>

                </div>


                <!-- ================================= -->
                <!-- SPIN BUTTON -->
                <!-- ================================= -->

                <button v-if="remainingItems.length > 0" class="btn btn-primary btn-lg mt-4 px-5" :disabled="isSpinning"
                    @click="spinWheel">

                    <i class="bi" :class="isSpinning
                        ? 'bi-arrow-repeat spin-icon'
                        : 'bi-play-fill'"></i>

                    {{ isSpinning ? 'Spinning...' : 'SPIN' }}

                </button>


                <!-- ================================= -->
                <!-- FINISHED -->
                <!-- ================================= -->

                <div v-if="
                    remainingItems.length === 0 &&
                    !isSpinning
                " class="mt-4">

                    <h4 class="text-success">
                        🎉 Finished!
                    </h4>

                    <p>
                        All vocabulary items have been used.
                    </p>

                </div>

            </div>

        </div>


        <!-- ================================= -->
        <!-- REVIEW SEQUENCE -->
        <!-- ================================= -->

        <div v-if="
            selectedItems.length > 0 &&
            remainingItems.length === 0 &&
            !isSpinning
        " class="card mx-auto mt-4" style="max-width: 700px;">

            <div class="card-header text-center fw-bold">
                Review Sequence
            </div>

            <div class="card-body">

                <p class="text-muted text-center">
                    Check your answers after writing the Kana.
                </p>


                <div class="table-responsive">

                    <table class="table table-striped table-bordered mb-0">

                        <thead class="table-light">

                            <tr>

                                <th class="text-center">
                                    #
                                </th>

                                <th class="text-center">
                                    Kanji
                                </th>

                                <th>
                                    Meaning
                                </th>

                                <th class="text-center">
                                    Kana
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            <tr v-for="(item, index) in selectedItems" :key="index">

                                <td class="text-center fw-bold">
                                    {{ index + 1 }}
                                </td>

                                <td class="text-center japanese fw-bold">
                                    {{ item.kanji || item.kana }}
                                </td>

                                <td>
                                    {{ item.meaning }}
                                </td>

                                <td class="text-center japanese">
                                    {{ item.kana }}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    </main>
</template>


<script setup>

import {
    ref,
    computed,
    onMounted
} from 'vue'

import { useRoute } from 'vue-router'

import {
    book1Vocabulary,
    book2Vocabulary
} from '../data/data'


const route = useRoute()


// ============================================
// SETTINGS FROM HOME
// ============================================

const numQuestions = computed(() => {

    return Number(route.query.items) || 10

})


const lessonStart = computed(() => {

    return Number(route.query.start) || 1

})


const lessonEnd = computed(() => {

    return Number(route.query.end) ||
        lessonStart.value

})


// ============================================
// ALL VOCABULARY
// ============================================

const allVocabulary = computed(() => {

    return [
        ...book1Vocabulary,
        ...book2Vocabulary
    ]

})


// ============================================
// VOCABULARY
// ============================================

const remainingItems = ref([])

const selectedItems = ref([])


// ============================================
// CURRENT RESULT
// ============================================

const currentItem = ref(null)


// ============================================
// WHEEL
// ============================================

const rotation = ref(0)

const isSpinning = ref(false)


// ============================================
// COLORS
// ============================================

const wheelColors = [
    '#ff6b6b',
    '#ffa94d',
    '#ffd43b',
    '#69db7c',
    '#38d9a9',
    '#4dabf7',
    '#748ffc',
    '#9775fa',
    '#da77f2',
    '#f783ac'
]


// ============================================
// GENERATE VOCABULARY
// ============================================

const generateVocabulary = () => {

    const available =
        allVocabulary.value.filter(item => {

            return (
                item.lesson >= lessonStart.value &&
                item.lesson <= lessonEnd.value
            )

        })


    // Shuffle
    const shuffled = [...available]
        .sort(() => Math.random() - 0.5)


    // Limit questions
    const count = Math.min(
        numQuestions.value,
        shuffled.length
    )


    remainingItems.value =
        shuffled.slice(0, count)


    selectedItems.value = []

    currentItem.value = null

    rotation.value = 0

}


// ============================================
// WHEEL BACKGROUND
// ============================================

const wheelStyle = computed(() => {

    const count =
        remainingItems.value.length


    if (!count) {

        return {

            transform:
                `rotate(${rotation.value}deg)`,

            background:
                '#f8f9fa'

        }

    }


    const segment =
        360 / count


    const slices =
        remainingItems.value.map(
            (_, index) => {

                const color =
                    wheelColors[
                    index %
                    wheelColors.length
                    ]


                const start =
                    index * segment


                const end =
                    (index + 1) * segment


                return `${color} ${start}deg ${end}deg`

            }
        )


    return {

        transform:
            `rotate(${rotation.value}deg)`,

        background:
            `conic-gradient(${slices.join(', ')})`

    }

})


// ============================================
// LABEL POSITION
// ============================================

const getLabelStyle = (index) => {

    const count =
        remainingItems.value.length


    if (!count) {
        return {}
    }


    const segment =
        360 / count


    /*
     * Put the text in the middle
     * of each pizza slice.
     */

    const angle =
        index * segment +
        segment / 2


    return {

        transform:
            `rotate(${angle}deg) translateY(-145px) rotate(${-angle}deg)`

    }

}


// ============================================
// SPIN
// ============================================

const spinWheel = () => {

    if (
        isSpinning.value ||
        remainingItems.value.length === 0
    ) {
        return
    }


    isSpinning.value = true

    currentItem.value = null


    const count =
        remainingItems.value.length


    // Random selected item
    const selectedIndex =
        Math.floor(
            Math.random() * count
        )


    const segment =
        360 / count


    /*
     * Position the selected slice
     * at the top pointer.
     */

    const targetAngle =
        360 -
        (
            selectedIndex * segment +
            segment / 2
        )


    // Full rotations
    const extraSpins =
        360 * 5


    rotation.value +=
        extraSpins +
        targetAngle


    // Wait for animation
    setTimeout(() => {

        const selected =
            remainingItems.value[
            selectedIndex
            ]


        // Save sequence
        selectedItems.value.push(
            selected
        )


        // Show current result
        currentItem.value =
            selected


        // Remove from wheel
        remainingItems.value.splice(
            selectedIndex,
            1
        )


        isSpinning.value = false

    }, 5000)

}


// ============================================
// INITIALIZE
// ============================================

onMounted(() => {

    generateVocabulary()

})

</script>


<style scoped>
/* ============================================
   WHEEL CONTAINER
============================================ */

.wheel-container {

    position: relative;

    width: 420px;

    height: 420px;

    margin: 30px auto;

}


/* ============================================
   POINTER
============================================ */

.pointer {

    position: absolute;

    top: -22px;

    left: 50%;

    transform:
        translateX(-50%);

    z-index: 20;

    font-size: 40px;

    color: #dc3545;

    line-height: 1;

    text-shadow:
        1px 1px 2px rgba(0, 0, 0, 0.3);

}


/* ============================================
   PIZZA WHEEL
============================================ */

.wheel {

    width: 100%;

    height: 100%;

    border-radius: 50%;

    border: 8px solid #343a40;

    position: relative;

    overflow: hidden;

    transition:
        transform 5s cubic-bezier(0.15,
            0.8,
            0.25,
            1);

    box-shadow:
        0 5px 15px rgba(0, 0, 0, 0.25);

}


/* ============================================
   WHEEL TEXT
============================================ */

.wheel-label {

    position: absolute;

    left: 50%;

    top: 50%;

    width: 100px;

    margin-left: -50px;

    margin-top: -15px;

    text-align: center;

    font-family:
        'NotoSerifJP',
        serif;

    font-size: 1.1rem;

    font-weight: bold;

    color: #212529;

    text-shadow:
        0 1px 2px rgba(255, 255, 255, 0.8);

    z-index: 2;

    pointer-events: none;

}


/* ============================================
   CENTER
============================================ */

.wheel-center {

    position: absolute;

    top: 50%;

    left: 50%;

    transform:
        translate(-50%, -50%);

    width: 85px;

    height: 85px;

    border-radius: 50%;

    background: white;

    border: 6px solid #343a40;

    display: flex;

    justify-content: center;

    align-items: center;

    font-weight: bold;

    font-size: 1rem;

    color: #343a40;

    z-index: 10;

    box-shadow:
        0 3px 8px rgba(0, 0, 0, 0.3);

}


/* ============================================
   CURRENT RESULT
============================================ */

.result-box {

    border: 1px solid #dee2e6;

    border-radius: 10px;

    padding: 20px;

    background: #f8f9fa;

}


.result-number {

    font-size: 0.85rem;

    color: #6c757d;

    margin-bottom: 5px;

}


.result-kanji {

    font-size: 2.5rem;

    font-family:
        'NotoSerifJP',
        serif;

    font-weight: bold;

}


.result-meaning {

    margin-top: 5px;

    font-size: 1.1rem;

    color: #6c757d;

}


.result-hint {

    margin-top: 10px;

    font-size: 0.9rem;

    color: #495057;

}


/* ============================================
   JAPANESE
============================================ */

.japanese {

    font-family:
        'NotoSerifJP',
        serif;

    font-size: 1.4rem;

}


/* ============================================
   SPIN ICON
============================================ */

.spin-icon {

    display: inline-block;

    animation:
        spin 1s linear infinite;

}


@keyframes spin {

    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }

}


/* ============================================
   MOBILE
============================================ */

@media (max-width: 576px) {

    .wheel-container {

        width: 320px;

        height: 320px;

    }


    .pointer {

        font-size: 32px;

        top: -18px;

    }


    .wheel-center {

        width: 65px;

        height: 65px;

        font-size: 0.8rem;

        border-width: 4px;

    }


    .wheel-label {

        width: 80px;

        margin-left: -40px;

        font-size: 0.8rem;

    }


    .result-kanji {

        font-size: 2rem;

    }

}
</style>