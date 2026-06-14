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

    var data = {"OkPercent": 85.92592592592592, "KoPercent": 14.074074074074074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.003703703703703704, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16666666666666666, 500, 1500, "M2: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "POST Livewire Product Search"], "isController": false}, {"data": [0.0, 500, 1500, "GET Product List Page"], "isController": false}, {"data": [0.0, 500, 1500, "M2: POST Livewire Login"], "isController": false}, {"data": [0.0, 500, 1500, "POST Livewire Create Category"], "isController": false}, {"data": [0.0, 500, 1500, "GET Create Category Page"], "isController": false}, {"data": [0.0, 500, 1500, "M1: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET Dashboard Page-1"], "isController": false}, {"data": [0.0, 500, 1500, "GET Dashboard Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET Orders Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "M4: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "M4: POST Livewire Login"], "isController": false}, {"data": [0.0, 500, 1500, "GET Product List Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET Product List Page-1"], "isController": false}, {"data": [0.0, 500, 1500, "GET Orders Page-1"], "isController": false}, {"data": [0.0, 500, 1500, "M1: POST Livewire Login"], "isController": false}, {"data": [0.0, 500, 1500, "M3: GET Login Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET Create Category Page-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET Dashboard Page"], "isController": false}, {"data": [0.0, 500, 1500, "GET Create Category Page-1"], "isController": false}, {"data": [0.0, 500, 1500, "GET Orders Page"], "isController": false}, {"data": [0.0, 500, 1500, "M3: POST Livewire Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 135, 19, 14.074074074074074, 10843.659259259259, 1467, 26886, 10192.0, 23972.400000000005, 26632.6, 26878.8, 1.4312825351724432, 38.87440603431367, 1.8308178487558444], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["M2: GET Login Page", 3, 0, 0.0, 5794.0, 1467, 9288, 6627.0, 9288.0, 9288.0, 9288.0, 0.2275830678197542, 9.60116067364588, 0.07489794321802458], "isController": false}, {"data": ["POST Livewire Product Search", 3, 3, 100.0, 11030.333333333334, 9902, 12613, 10576.0, 12613.0, 12613.0, 12613.0, 0.11963153487259241, 0.853659790345735, 0.15479666377557122], "isController": false}, {"data": ["GET Product List Page", 3, 0, 0.0, 25977.333333333332, 24885, 26704, 26343.0, 26704.0, 26704.0, 26704.0, 0.07160588122971166, 3.0963949422379224, 0.1484563338385526], "isController": false}, {"data": ["M2: POST Livewire Login", 3, 3, 100.0, 11188.0, 7184, 13279, 13101.0, 13279.0, 13279.0, 13279.0, 0.12399256044637322, 0.8847789445133292, 0.1795712569745815], "isController": false}, {"data": ["POST Livewire Create Category", 2, 2, 100.0, 11204.5, 11092, 11317, 11204.5, 11317.0, 11317.0, 11317.0, 0.1353637901861252, 0.9659211082910322, 0.19432106598984772], "isController": false}, {"data": ["GET Create Category Page", 2, 0, 0.0, 26744.0, 26626, 26862, 26744.0, 26862.0, 26862.0, 26862.0, 0.06592827004219409, 2.85088261471519, 0.13726471848628694], "isController": false}, {"data": ["M1: GET Login Page", 5, 0, 0.0, 7881.8, 3621, 12753, 8356.0, 12753.0, 12753.0, 12753.0, 0.2422245906404418, 10.21884991764364, 0.07971649125569227], "isController": false}, {"data": ["GET Dashboard Page-1", 25, 0, 0.0, 6300.239999999999, 2455, 13622, 4718.0, 12266.600000000004, 13562.6, 13622.0, 0.35816618911174786, 15.110136103151863, 0.37075796919770776], "isController": false}, {"data": ["GET Dashboard Page-0", 25, 0, 0.0, 7361.880000000001, 4273, 13526, 5239.0, 13386.2, 13506.2, 13526.0, 0.3108563470648944, 0.3278563035450058, 0.3229991731221168], "isController": false}, {"data": ["GET Orders Page-0", 4, 0, 0.0, 13339.25, 13193, 13469, 13347.5, 13469.0, 13469.0, 13469.0, 0.11747085254471235, 0.1238950397932513, 0.12171540483392558], "isController": false}, {"data": ["M4: GET Login Page", 2, 0, 0.0, 4680.0, 4609, 4751, 4680.0, 4751.0, 4751.0, 4751.0, 0.3008423586040915, 12.69178700361011, 0.09900769028279183], "isController": false}, {"data": ["M4: POST Livewire Login", 2, 2, 100.0, 11221.0, 10385, 12057, 11221.0, 12057.0, 12057.0, 12057.0, 0.1418942887548776, 1.012521062433487, 0.2054972951401206], "isController": false}, {"data": ["GET Product List Page-0", 3, 0, 0.0, 13358.333333333334, 13177, 13449, 13449.0, 13449.0, 13449.0, 13449.0, 0.0984898227183191, 0.10387598489822718, 0.10224089995075508], "isController": false}, {"data": ["GET Product List Page-1", 3, 0, 0.0, 12618.666666666666, 11436, 13526, 12894.0, 13526.0, 13526.0, 13526.0, 0.10446409917125148, 4.407079183787172, 0.10813666515774079], "isController": false}, {"data": ["GET Orders Page-1", 4, 0, 0.0, 12349.25, 11271, 13611, 12257.5, 13611.0, 13611.0, 13611.0, 0.12449811696598088, 5.252264309502319, 0.12887500389056616], "isController": false}, {"data": ["M1: POST Livewire Login", 5, 5, 100.0, 11587.2, 7651, 13424, 13246.0, 13424.0, 13424.0, 13424.0, 0.1644736842105263, 1.1736418071546053, 0.23819772820723686], "isController": false}, {"data": ["M3: GET Login Page", 4, 0, 0.0, 7576.5, 2544, 11859, 7951.5, 11859.0, 11859.0, 11859.0, 0.22532672374943669, 9.50597115817936, 0.07415537685894548], "isController": false}, {"data": ["GET Create Category Page-0", 2, 0, 0.0, 13405.5, 13384, 13427, 13405.5, 13427.0, 13427.0, 13427.0, 0.11670654140164556, 0.12308893038454805, 0.1221771605298477], "isController": false}, {"data": ["GET Dashboard Page", 25, 0, 0.0, 13662.559999999998, 7214, 26886, 9886.0, 25759.000000000004, 26880.0, 26886.0, 0.30104522903521025, 13.017854239921006, 0.6244336586628776], "isController": false}, {"data": ["GET Create Category Page-1", 2, 0, 0.0, 13337.5, 13199, 13476, 13337.5, 13476.0, 13476.0, 13476.0, 0.11799410029498526, 4.977876106194691, 0.12214233038348084], "isController": false}, {"data": ["GET Orders Page", 4, 0, 0.0, 25689.25, 24510, 26805, 25721.0, 26805.0, 26805.0, 26805.0, 0.08825541115989674, 3.8163570372658473, 0.18280246784193455], "isController": false}, {"data": ["M3: POST Livewire Login", 4, 4, 100.0, 11632.5, 7816, 13424, 12645.0, 13424.0, 13424.0, 13424.0, 0.1397233477714126, 0.9970297872712031, 0.20235324682129383], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["419/unknown status", 19, 100.0, 14.074074074074074], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 135, 19, "419/unknown status", 19, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["POST Livewire Product Search", 3, 3, "419/unknown status", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["M2: POST Livewire Login", 3, 3, "419/unknown status", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Livewire Create Category", 2, 2, "419/unknown status", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["M4: POST Livewire Login", 2, 2, "419/unknown status", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["M1: POST Livewire Login", 5, 5, "419/unknown status", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["M3: POST Livewire Login", 4, 4, "419/unknown status", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
