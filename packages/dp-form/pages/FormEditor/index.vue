<template>
    <div class="fullPageContainer">
        <div class="listContainer">
             <!-- <ContentList path="/form" >
                <template  v-slot="{ list }">
                    <div v-for="form in list" :key="form._path">
                        <h2>{{ form.title }}</h2>
                        <p>{{ form.description }}</p>
                    </div>
                </template>
                <template #not-found>
                    <p>No Form found.</p>
                </template>
               
            </ContentList> -->
        </div>
        {{ data }}
    </div>
</template>


<script lang="ts" setup>
const { data } = await useAsyncData('home', () => queryContent('/form').find())
</script>
