/*jslint browser: true*/
/*globals canvasDatagrid: false*/
var data;
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function parseOpenData(openData) {
        var data, schema;
        schema = openData.meta.view.columns;
        data = openData.data.map(function (row) {
            var r = {};
            schema.forEach(function (column, index) {
                r[column.name] = row[index];
            });
            return r;
        });
        return {
            data: data,
            schema: schema
        };
    }
    function loadDataSet(url) {
        document.body.innerHTML = '';
        var xhr = new XMLHttpRequest(),
            grid = canvasDatagrid({
                parentNode: document.body
            });
        grid.addEventListener('contextmenu', function (e) {
            var item = document.createElement('div'),
                getDataButton = document.createElement('button'),
                urlInput = document.createElement('input');
            getDataButton.innerHTML = 'GET';
            getDataButton.onclick = function () {
                loadDataSet(urlInput.value);
            };
            item.addEventListener('click', function (e) { e.stopPropagation(); });
            item.appendChild(urlInput);
            item.appendChild(getDataButton);
            e.items.push({
                title: item
            });
        });
        xhr.addEventListener('progress', function (e) {
            grid.data = [{ status: 'Loading data ' + e.loaded + '...'}];
        });
        xhr.addEventListener('load', function (e) {
            grid.data = [{ status: 'Loading data ' + e.loaded + '...'}];
            var openData = parseOpenData(JSON.parse(this.responseText));
            grid.schema = openData.schema;
            grid.data = openData.data;
        });
        xhr.open('GET', url);
        xhr.send();
    }
    loadDataSet('https://data.cityofchicago.org/api/views/xzkq-xp2w/rows.json?accessType=DOWNLOAD');
});