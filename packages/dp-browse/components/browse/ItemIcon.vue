<template>
    <div class="iconContainer">
         <SvgIcon :src="iconSrc" />
    </div>
</template>

<script lang="ts" setup>
type IconType = 'folder' | 'file'
type IconStatus = 'normal' | 'selected' | 'general'
 const props = withDefaults( defineProps<{
        type: IconType;
        status?: IconStatus;
        mimeType?: string;
    }>() , {
        type: 'folder',
        status: 'general'
    })

    const iconSrc = computed(() => {
        const { type, status, mimeType } = props
        if(mimeType) {
             return mimeTypeToSrc()
        }else {
            return `/icons/${type}-${status}.svg`
        }
    })

    function mimeTypeToSrc() {
        // if mimetype is image, return image src
        if(props.mimeType?.startsWith('image')) {
            return `/icons/doc/image.svg`
        }

        // if mimetype is video, return video src
        if(props.mimeType?.startsWith('video')) {
            return `/icons/doc/video.svg`
        }
        // if mimetype is audio, return audio src
        if(props.mimeType?.startsWith('audio')) {
            return `/icons/doc/audio.svg`
        }

        // if mimetype is pdf, return pdf src
        if(props.mimeType?.startsWith('application/pdf')) {
            return `/icons/doc/pdf.svg`
        }
        // if mimetype is text, return text src
        if(props.mimeType?.startsWith('text')) {
            return `/icons/doc/text.svg`
        }
        // if mimetype is zip, return zip src
        if(props.mimeType?.startsWith('application/zip')) {
            return `/icons/doc/zip.svg`
        }
        // if mimetype is .xls or xlsx return  excel src
        if(props.mimeType?.startsWith('application/vnd.ms-excel') || props.mimeType?.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            return `/icons/doc/excel.svg`
        }

        // if mimetype is word, return word src
        if(props.mimeType?.startsWith('application/msword') || props.mimeType?.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            return `/icons/doc/word.svg`
        }
        // if mimetype is ppt, return ppt src
        if(props.mimeType?.startsWith('application/vnd.ms-powerpoint') || props.mimeType?.startsWith('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
            return `/icons/doc/ppt.svg`
        }
        
        // if mimetype is unknown, return unknown src
        return `/icons/doc/file.svg`

    }
    
</script>
