<template>
    <div class="container py-3">

        <!-- Header -->
        <div class="mb-3 d-flex align-items-center gap-2">

            <router-link to="/" class="btn btn-outline-secondary bg-light" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>

            <div class="btn-group w-100">

                <button class="btn" :class="activeType === 'hiragana'
                    ? 'btn-primary'
                    : 'btn-dark'
                    " @click="activeType = 'hiragana'">
                    ひらがな
                </button>

                <button class="btn" :class="activeType === 'katakana'
                    ? 'btn-primary'
                    : 'btn-dark'
                    " @click="activeType = 'katakana'">
                    カタカナ
                </button>

            </div>

        </div>


        <!-- ================================= -->
        <!-- BASIC KANA -->
        <!-- ================================= -->

        <div class="card mb-3">

            <div class="card-header text-center fw-bold">
                Basic Kana
            </div>

            <div class="card-body p-2">

                <div class="kana-table">

                    <!-- Header -->

                    <div class="kana-row kana-header">

                        <div class="row-label"></div>

                        <div v-for="vowel in vowels" :key="vowel" class="kana-cell">
                            {{ vowel }}
                        </div>

                    </div>


                    <!-- Basic Rows -->

                    <div v-for="row in basicRows" :key="row.label" class="kana-row">

                        <div class="row-label">
                            {{ row.label }}
                        </div>

                        <div v-for="(item, index) in row.items" :key="index" class="kana-cell kana-clickable"
                            :class="{ empty: !item.kana }">

                            <template v-if="item.kana">

                                <div class="kana">
                                    {{ item.kana }}
                                </div>

                                <div class="romaji">
                                    {{ item.romaji }}
                                </div>

                            </template>

                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- ================================= -->
        <!-- DAKUTEN / HANDAKUTEN -->
        <!-- ================================= -->

        <div class="card mb-3">

            <div class="card-header text-center fw-bold">
                Dakuten / Handakuten
            </div>

            <div class="card-body p-2">

                <div class="kana-table">

                    <div v-for="row in dakutenRows" :key="row.label" class="kana-row">

                        <div class="row-label">
                            {{ row.label }}
                        </div>

                        <div v-for="(item, index) in row.items" :key="index" class="kana-cell kana-clickable">

                            <div class="kana">
                                {{ item.kana }}
                            </div>

                            <div class="romaji">
                                {{ item.romaji }}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- ================================= -->
        <!-- COMBINATION SOUNDS -->
        <!-- ================================= -->

        <div class="card mb-3">

            <div class="card-header text-center fw-bold">
                Combination Sounds
            </div>

            <div class="card-body p-2">

                <div class="combination-grid">

                    <div v-for="item in currentCombination" :key="item.kana" class="kana-card kana-clickable">

                        <div class="kana">
                            {{ item.kana }}
                        </div>

                        <div class="romaji">
                            {{ item.romaji }}
                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- ================================= -->
        <!-- KATAKANA SPECIAL SOUNDS -->
        <!-- ================================= -->

        <div v-if="activeType === 'katakana'" class="card mb-3">

            <div class="card-header text-center fw-bold">
                Extended / Foreign Sounds
            </div>

            <div class="card-body p-2">

                <div class="combination-grid">

                    <div v-for="item in katakanaSpecial" :key="item.kana" class="kana-card kana-clickable">

                        <div class="kana">
                            {{ item.kana }}
                        </div>

                        <div class="romaji">
                            {{ item.romaji }}
                        </div>

                    </div>

                </div>

            </div>

        </div>



    </div>
</template>


<script setup>

import { ref, computed } from 'vue'

import {
    hiragana,
    katakana,
    hiraganaDakuten,
    katakanaDakuten,
    hiraganaCombination,
    katakanaCombination,
    katakanaSpecial
} from '../data/alphabet'


// ============================================
// ACTIVE TYPE
// ============================================

const activeType = ref('hiragana')


// ============================================
// VOWELS
// ============================================

const vowels = [
    'A',
    'I',
    'U',
    'E',
    'O'
]


// ============================================
// BASIC ROWS
// ============================================

const createRows = (alphabet) => {

    const rows = [

        { label: '', start: 0 },      // A

        { label: 'K', start: 5 },

        { label: 'S', start: 10 },

        { label: 'T', start: 15 },

        { label: 'N', start: 20 },

        { label: 'H', start: 25 },

        { label: 'M', start: 30 },

        { label: 'Y', start: 35 },

        { label: 'R', start: 38 },

        { label: 'W', start: 43 }

    ]

    return rows.map(row => {

        const items = []

        for (let i = 0; i < 5; i++) {

            const item = alphabet[row.start + i]

            items.push(
                item || {
                    kana: '',
                    romaji: ''
                }
            )

        }

        return {
            label: row.label,
            items
        }

    })

}


const basicRows = computed(() => {

    return activeType.value === 'hiragana'
        ? createRows(hiragana)
        : createRows(katakana)

})


// ============================================
// DAKUTEN ROWS
// ============================================

const createDakutenRows = (alphabet) => {

    return [

        {
            label: 'G',
            items: alphabet.slice(0, 5)
        },

        {
            label: 'Z',
            items: alphabet.slice(5, 10)
        },

        {
            label: 'D',
            items: alphabet.slice(10, 15)
        },

        {
            label: 'B',
            items: alphabet.slice(15, 20)
        },

        {
            label: 'P',
            items: alphabet.slice(20, 25)
        }

    ]

}


const dakutenRows = computed(() => {

    return activeType.value === 'hiragana'
        ? createDakutenRows(hiraganaDakuten)
        : createDakutenRows(katakanaDakuten)

})


// ============================================
// COMBINATION SOUNDS
// ============================================

const currentCombination = computed(() => {

    return activeType.value === 'hiragana'
        ? hiraganaCombination
        : katakanaCombination

})


// ============================================
// KATAKANA SPECIAL SOUNDS
// ============================================

const currentKatakanaSpecial = computed(() => {

    return activeType.value === 'katakana'
        ? katakanaSpecial
        : []

})


</script>


<style scoped>
.kana-table {
    width: 100%;
}


/* ============================================ */
/* ROW */
/* ============================================ */

.kana-row {

    display: grid;

    grid-template-columns:
        45px repeat(5, 1fr);

    border-bottom: 1px solid #dee2e6;

}


.kana-row:last-child {
    border-bottom: none;
}


/* ============================================ */
/* HEADER */
/* ============================================ */

.kana-header {

    background-color: #f8f9fa;

    font-weight: bold;

}


/* ============================================ */
/* ROW LABEL */
/* ============================================ */

.row-label {

    display: flex;

    justify-content: center;

    align-items: center;

    font-weight: bold;

    color: #6c757d;

}


/* ============================================ */
/* KANA CELL */
/* ============================================ */

.kana-cell {

    min-height: 70px;

    display: flex;

    flex-direction: column;

    justify-content: center;

    align-items: center;

    border-left: 1px solid #dee2e6;

}


/* ============================================ */
/* CLICKABLE */
/* ============================================ */

.kana-clickable {

    cursor: pointer;

    transition:
        background-color 0.15s;

}


.kana-clickable:hover {

    background-color: #f1f3f5;

}


.kana-clickable:active {

    background-color: #e9ecef;

}


/* ============================================ */
/* KANA */
/* ============================================ */

.kana {

    font-size: 2rem;

    font-family:
        'NotoSerifJP',
        serif;

}


/* ============================================ */
/* ROMAJI */
/* ============================================ */

.romaji {

    font-size: 0.8rem;

    color: #6c757d;

}


/* ============================================ */
/* EMPTY CELL */
/* ============================================ */

.empty {

    background-color: #f8f9fa;

}


/* ============================================ */
/* COMBINATION */
/* ============================================ */

.combination-grid {

    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 8px;

}


.kana-card {

    border: 1px solid #dee2e6;

    border-radius: 8px;

    padding: 10px 5px;

    text-align: center;

}


/* ============================================ */
/* MOBILE */
/* ============================================ */

@media (max-width: 576px) {

    .kana-row {

        grid-template-columns:
            32px repeat(5, 1fr);

    }


    .kana-cell {

        min-height: 60px;

    }


    .kana {

        font-size: 1.5rem;

    }


    .romaji {

        font-size: 0.7rem;

    }


    .combination-grid {

        grid-template-columns:
            repeat(4, 1fr);

        gap: 5px;

    }


    .kana-card {

        padding: 8px 3px;

    }

}
</style>