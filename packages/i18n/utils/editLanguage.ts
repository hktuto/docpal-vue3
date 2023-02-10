

const openDialog =(ev:Event, el:HTMLElement) => {
    ev.stopPropagation();
    console.log(el);
}

export const EditLanguage = () => {
    // @ts-ignore
    const app = useAppStore()
    
    // step 1 get all multi language element
    const els = document.querySelectorAll('[data-i18n');

    els.forEach((el:HTMLElement) => {
        el.addEventListener('click', (e) => openDialog(e,el));
        el.classList.add('editLanguageItem')
    })

}

export const stopEditLanguage = () => {
    const els = document.querySelectorAll('[data-i18n');
    els.forEach((el:HTMLElement) => {
        el.removeEventListener('click', (e) => openDialog(e,el))
        el.classList.remove('editLanguageItem')
    })
}