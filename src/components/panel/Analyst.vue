<template>
    <div>
        <a-divider>分析</a-divider>
        <div>
            <a-progress type="circle" :percent="75" />
            <a-progress type="circle" :percent="70" status="exception" />
            <a-progress type="circle" :percent="100" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Analyst'
}
</script>