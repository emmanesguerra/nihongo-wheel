<template>
    <div class="container py-3">

        <!-- Navigation + Lesson Selector -->
        <div class="mb-2 d-flex align-items-center gap-2">

            <router-link to="/" class="btn btn-outline-secondary bg-light" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>

            <select id="lesson-select" v-model="selectedLesson" class="form-select w-auto">
                <option v-for="n in lessonRange" :key="n" :value="n">
                    Lesson {{ String(n).padStart(2, '0') }}
                </option>
            </select>

            <!-- Search -->
            <div class="search-box">

                <!-- Search Input -->
                <div class="position-relative flex-grow-1">

                    <input type="text" v-model="searchQuery" class="form-control search-input pe-5"
                        placeholder="Search..." @keyup.enter="performSearch" />

                    <!-- Clear Button -->
                    <i v-if="searchQuery"
                        class="bi bi-x-circle-fill text-muted position-absolute top-50 end-0 translate-middle-y me-2"
                        style="cursor: pointer;" @click="clearSearch"></i>

                </div>

                <!-- Search Button -->
                <button class="search-button" type="button" @click="performSearch" title="Search">
                    <i class="bi bi-search"></i>
                </button>

            </div>

        </div>




        <!-- Search Result Count -->
        <p v-if="activeSearch" class="small m-3">
            Find {{ filteredVocabularies.length }} Items
        </p>


        <!-- Vocabulary Table -->
        <div class="table-responsive" style="max-height: 75vh; overflow-y: auto;">

            <table class="table table-striped table-bordered mb-0">

                <thead class="table-dark">
                    <tr>
                        <th class="centered">#</th>
                        <th class="centered">Kanji</th>
                        <th class="centered">Kana</th>
                        <th class="centered">Meaning</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="(item, index) in filteredVocabularies" :key="index">

                        <!-- Number / Lesson -->
                        <td class="centered">
                            {{ activeSearch ? "L" + item.lesson : index + 1 }}
                        </td>

                        <!-- Kanji -->
                        <td class="centered fw-bold japanese" style="cursor: pointer;">
                            {{ item.kanji || "—" }}
                        </td>

                        <!-- Kana -->
                        <td class="centered japanese" style="cursor: pointer;">
                            {{ item.kana }}
                        </td>

                        <!-- Meaning -->
                        <td class="text-start">
                            {{ item.meaning }}
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </div>
</template>


<script setup>

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import {
    book1Vocabulary,
    book2Vocabulary
} from '../data/data'


const route = useRoute()


// ------------------------------------
// Book Selection
// ------------------------------------

const isBook2 = computed(() => {
    return route.query.set === 'book2'
})


const vocabularies = computed(() => {

    return isBook2.value
        ? book2Vocabulary
        : book1Vocabulary

})

const allVocabularies = computed(() => {
    return [
        ...book1Vocabulary,
        ...book2Vocabulary
    ]
})


// ------------------------------------
// Lesson Range
// ------------------------------------

const lessonRange = computed(() => {

    if (isBook2.value) {

        return Array.from(
            { length: 25 },
            (_, i) => i + 26
        )

    }

    return Array.from(
        { length: 25 },
        (_, i) => i + 1
    )

})


// ------------------------------------
// Selected Lesson
// ------------------------------------

const selectedLesson = ref(
    isBook2.value ? 26 : 1
)


// ------------------------------------
// Search
// ------------------------------------

// What the user is currently typing
const searchQuery = ref('')

// What the application is actually searching for
const activeSearch = ref('')


// ------------------------------------
// Perform Search
// ------------------------------------

const performSearch = () => {

    activeSearch.value = searchQuery.value.trim()

}


// ------------------------------------
// Filter Vocabulary
// ------------------------------------

const filteredVocabularies = computed(() => {

    // --------------------------------
    // No active search
    // Show selected lesson
    // --------------------------------

    if (!activeSearch.value) {

        return vocabularies.value.filter(
            item => item.lesson === selectedLesson.value
        )

    }


    // --------------------------------
    // Active search
    // Search entire book
    // --------------------------------

    const query = activeSearch.value.toLowerCase()

    return allVocabularies.value.filter(item => {

        return (

            item.kanji?.toLowerCase().includes(query) ||

            item.kana?.toLowerCase().includes(query) ||

            item.meaning?.toLowerCase().includes(query)

        )

    })

})


// ------------------------------------
// Clear Search
// ------------------------------------

const clearSearch = () => {

    searchQuery.value = ''

    activeSearch.value = ''

}

</script>


<style scoped>
.centered {
    text-align: center;
    vertical-align: middle;
}

.japanese {
    font-size: 1.1rem;
}

.search-box {
    display: flex;
    width: 100%;
    border: 1px solid #ced4da;
    border-radius: 6px;
    overflow: hidden;
    background: white;
}

.search-input {
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
}

.search-input:focus {
    border: none !important;
    box-shadow: none !important;
}

.search-button {
    border: none;
    border-left: 1px solid #ced4da;
    background-color: #0d6efd;
    color: white;
    width: 50px;
    flex-shrink: 0;
}

.search-button:hover {
    background-color: #0b5ed7;
}

.search-button:active {
    background-color: #0a58ca;
}
</style>