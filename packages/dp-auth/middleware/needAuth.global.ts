import Keycloak from 'keycloak-js'
export default defineNuxtRouteMiddleware((to, from) => {
    const { public: {keycloakConfig} } = useRuntimeConfig();
    // @ts-ignore
    window.$keycloak = new Keycloak(keycloakConfig)
})