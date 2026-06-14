/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 2.08955223880597, "KoPercent": 97.91044776119404};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [7.462686567164179E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.016666666666666666, 500, 1500, "M2: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "POST Livewire Product Search"], "isController": false}, {"data": [0.0, 500, 1500, "GET Product List Page"], "isController": false}, {"data": [0.0, 500, 1500, "M2: POST Livewire Login"], "isController": false}, {"data": [0.0, 500, 1500, "POST Livewire Create Category"], "isController": false}, {"data": [0.0, 500, 1500, "GET Create Category Page"], "isController": false}, {"data": [0.0, 500, 1500, "M1: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "M4: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "M4: POST Livewire Login"], "isController": false}, {"data": [0.0, 500, 1500, "M1: POST Livewire Login"], "isController": false}, {"data": [0.0, 500, 1500, "M3: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET Dashboard Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET Orders Page"], "isController": false}, {"data": [0.0, 500, 1500, "M3: POST Livewire Login"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 670, 656, 97.91044776119404, 4769.623880597015, 0, 15018, 29.0, 15008.0, 15013.0, 15016.0, 19.821312348381753, 68.87284891611444, 0.13630619120170404], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["M2: GET Login Page", 30, 26, 86.66666666666667, 13936.766666666666, 1450, 15014, 15002.5, 15012.9, 15013.45, 15014.0, 1.5171437240821282, 12.112555470567411, 0.06657258268433296], "isController": false}, {"data": ["POST Livewire Product Search", 30, 30, 100.0, 14.266666666666667, 1, 29, 14.0, 28.0, 28.45, 29.0, 2.024701356549909, 5.295068586758453, 0.0], "isController": false}, {"data": ["GET Product List Page", 30, 30, 100.0, 514.2, 1, 15013, 15.0, 32.800000000000004, 6775.099999999989, 15013.0, 1.8134558423502387, 4.749046518920389, 0.0], "isController": false}, {"data": ["M2: POST Livewire Login", 30, 30, 100.0, 12011.433333333334, 2, 15016, 15006.5, 15014.9, 15016.0, 15016.0, 0.9509922018639447, 2.568050426361504, 0.0], "isController": false}, {"data": ["POST Livewire Create Category", 20, 20, 100.0, 16.950000000000003, 2, 30, 13.5, 28.900000000000002, 29.95, 30.0, 1.3532715339332837, 3.5391222342513027, 0.0], "isController": false}, {"data": ["GET Create Category Page", 20, 20, 100.0, 12.049999999999999, 1, 31, 15.0, 16.900000000000002, 30.29999999999999, 31.0, 1.3540961408259986, 3.5412787745429926, 0.0], "isController": false}, {"data": ["M1: GET Login Page", 50, 46, 92.0, 14498.119999999999, 3330, 15017, 15002.0, 15011.6, 15014.9, 15017.0, 2.0249473513688647, 11.904554739389276, 0.05331306698525838], "isController": false}, {"data": ["M4: GET Login Page", 20, 17, 85.0, 14073.999999999996, 4285, 15016, 15002.5, 15014.8, 15015.95, 15016.0, 1.0155377272265664, 8.775822823575709, 0.05013225792119427], "isController": false}, {"data": ["M4: POST Livewire Login", 20, 20, 100.0, 12011.5, 17, 15017, 15007.5, 15015.9, 15016.95, 15017.0, 0.6793939805693321, 1.8346291358108568, 0.0], "isController": false}, {"data": ["M1: POST Livewire Login", 50, 50, 100.0, 6015.56, 3, 15016, 27.5, 15012.8, 15016.0, 15016.0, 1.646090534979424, 4.375, 0.0], "isController": false}, {"data": ["M3: GET Login Page", 40, 37, 92.5, 14439.574999999997, 2409, 15018, 15002.0, 15013.8, 15015.0, 15018.0, 1.6204172574437918, 9.206588958375532, 0.03999613884950375], "isController": false}, {"data": ["GET Dashboard Page", 250, 250, 100.0, 78.16400000000002, 0, 15012, 16.0, 31.0, 32.0, 42.0, 16.21271076523995, 42.40694157344358, 0.0], "isController": false}, {"data": ["GET Orders Page", 40, 40, 100.0, 391.45000000000005, 1, 15014, 16.0, 31.0, 31.949999999999996, 15014.0, 2.45474071801166, 6.4262546985271545, 0.0], "isController": false}, {"data": ["M3: POST Livewire Login", 40, 40, 100.0, 6014.800000000001, 2, 15016, 28.5, 15014.0, 15015.95, 15016.0, 1.2781594503914362, 3.3971081642434893, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 451, 68.75, 67.31343283582089], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 205, 31.25, 30.597014925373134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 670, 656, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 451, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 205, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["M2: GET Login Page", 30, 26, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Livewire Product Search", 30, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Product List Page", 30, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 29, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["M2: POST Livewire Login", 30, 30, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 24, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Livewire Create Category", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Create Category Page", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["M1: GET Login Page", 50, 46, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["M4: GET Login Page", 20, 17, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["M4: POST Livewire Login", 20, 20, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 16, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["M1: POST Livewire Login", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 30, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 20, "", "", "", "", "", ""], "isController": false}, {"data": ["M3: GET Login Page", 40, 37, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Dashboard Page", 250, 250, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 249, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Orders Page", 40, 40, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 39, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["M3: POST Livewire Login", 40, 40, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8000 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: getsockopt", 24, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 16, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
