# 基于VUE和ArcGIS/Core的WebGIS平台

## 组件结构

```
main
    App
        MainLayout
            Header
            Sidebar
                panel/BaseLayer
                panel/Search
                panel/Analyst
                panel/About
            MainPanel
                mapcomponent/MapTool
                mapcomponent/POISearch
                mapcomponent/MapObj

```


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration

```
scp -r documents/vscode/arcgisvue419/dist/* ubuntu@101.34.36.64:/var/www/html/arcgisvue
```
