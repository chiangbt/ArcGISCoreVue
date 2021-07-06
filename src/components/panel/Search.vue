<template>
    <div>
        <a-divider>查询</a-divider>
        <a-date-picker @change="onChange" />
    </div>
</template>

<script>
export default {
    name: 'Search',
    methods: {
        onChange(date, dateString) {
            console.log(date, dateString);
        }
    },
}
</script>