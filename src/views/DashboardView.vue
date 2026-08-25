<template>
    <main class="container text-center py-5">
        <h1 class="nwroman">みんなの日本語 I & II</h1>

        <!-- Exam Setup Form -->
        <div class="card mx-auto mb-3" style="max-width: 450px;">
            <div class="card-body text-start">
                <div class="mb-3">
                    <label class="form-label"><strong>Number of Items</strong></label>
                    <select v-model="numQuestions" class="form-select">
                        <option v-for="n in [5, 10, 20, 50, 75, 100]" :key="n" :value="n">{{ n }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label"><strong>Vocabulary</strong>【1~50】</label>
                    <div class="d-flex gap-2">
                        <input type="number" v-model.number="lessonStart" class="form-control" min="1" max="50"
                            placeholder="Start">
                        <input type="number" v-model.number="lessonEnd" class="form-control" min="1" max="50"
                            placeholder="End (optional)">
                    </div>
                </div>

                <div class="mt-4 text-center">
                    <p v-if="errorMessage" class="text-danger text-center mb-3">{{ errorMessage }}</p>
                    <button class="btn btn-primary" @click="startExam">
                        <i class="bi bi-play-fill me-2"></i> Generate wheel
                    </button>
                </div>
            </div>
        </div>

        <div class="card mx-auto" style="max-width: 450px;">
            <div class="card-body text-start">
                <!-- View Vocabulary Button -->
                <div class="mt-2 d-flex justify-content-center gap-2">
                    <router-link to="/vocab-list?set=book1" class="btn btn-outline-secondary w-50 n5-row">
                        <i class="bi bi-journal-bookmark me-1"></i> Lessons 01–25
                    </router-link>
                    <router-link to="/vocab-list?set=book2" class="btn btn-outline-secondary w-50 n5-row">
                        <i class="bi bi-journal-bookmark me-1"></i> Lessons 26–50
                    </router-link>
                </div>
                <div class="mt-2 d-flex justify-content-center gap-2">
                    <router-link to="/alphabet" class="btn btn-outline-secondary kanji-row">
                        <i class="bi bi-journal-bookmark me-1"></i> Hiragana and Katakana Table
                    </router-link>
                </div>
            </div>
        </div>
    </main>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const numQuestions = ref(50)
const lessonStart = ref()
const lessonEnd = ref()
const errorMessage = ref('')

const startExam = () => {

    errorMessage.value = ''

    if (!lessonStart.value) {
        errorMessage.value = 'Please enter a starting lesson.'
        return
    }

    if (!lessonEnd.value) {
        lessonEnd.value = lessonStart.value
    }

    if (lessonEnd.value < lessonStart.value) {
        errorMessage.value =
            'End lesson cannot be lower than start lesson.'
        return
    }

    router.push({
        path: '/wheel',
        query: {
            items: numQuestions.value,
            start: lessonStart.value,
            end: lessonEnd.value
        }
    })

}

</script>

<style scoped>
.nwroman {
    font-family: 'NotoSerifJP', Times, serif;
    color: #f7f5f5;
    text-shadow: #0f0f0f 1px 1px, #0a0a0a 2px 2px;
}

.n5-row {
    background-color: #ffe5b4;
}

.n4-row {
    background-color: #d3f9d8;
}

.kanji-row {
    background-color: #f9dad3;
}

.card {
    background: #f7f5f5;
}
</style>