
var foo = { x: 1, y: 2 } 

var Log = {

    _toQueryString: function (obj) {
        return Object.keys(obj).map(function (p) {
            return p + '=' + obj[p];
        }).join('&')
    },

    transport: function (params) {
        var req = new XMLHttpRequest();
        req.open("GET", 'http://local.ft.com:5001/log?' + this._toQueryString(params), true);
        req.onload = function () {
            console.log('loaded!')
        };
        req.send(null);
    },

    dwell: function (meta) {
        meta.event = 'dwell'
        this.transport(meta);
    },

    view: function (meta) {
        meta.event = 'view'
        this.transport(meta);
    },

    scroll: function (meta) {
        meta.event = 'scroll'
        this.transport(meta);
    }
    
};

(function() { 

    var story = document.querySelector('.fullstory h1');
    if (story) {

        var colors = [  'rgb(139, 171, 174)',
                        'rgb(229, 22, 145)',
                        'rgb(245, 111, 2)', 
                        'rgb(0, 172, 238)',
                        'rgb(176, 213, 62)'
                     ]

        // the dot
        var dot = document.createElement("span");
        dot.className = 'dot';
        dot.textContent = '●';

        // ... 
        dot.style.position = 'absolute';
        dot.style.display = 'inline-block';
        dot.style.fontSize = '32px';
        dot.style.lineHeight = '32px';
        dot.style.marginLeft = '-30px';
        dot.style.color = colors[Math.ceil(Math.random()*colors.length)-1]

        story.parentNode.insertBefore(dot, story);
    }

    var rail = document.querySelector('.railSection');
    if (rail) { rail.style.display = 'none' } 
    // ...
    
    //chrome.tabs.getSelected({}, function(tab) {
    //      chrome.tabs.update(tab.id, {url: 'http://google.com'});
    //});
    
    // DELETE chrome.storage.local.set({ history: [] }, function(err) { })
    
    // Object storing all attributes of a page that the invoicing system needs
    var meta = { 
        path: location.pathname,
        date: new Date().toISOString()
    };

    // Log a view   
    Log.view(meta); 

    // Log an n second dwell
    setTimeout(function () {
        Log.dwell(meta);
    }, 5000)
 
    // ref: https://developer.chrome.com/apps/storage
    chrome.storage.local.get(null, function(storage) {
        
        // append existing history, otherwise create
        var h = (storage.history) ? storage.history.concat([meta]) : [meta];
        console.log(storage, storage.history, h);
        chrome.storage.local.set({ history: h }, function(err) {
           console.log(err, 'Saved');
        });
    });

    // Things to track - i) url, ii) scroll depth, iii) dwell 

    // Invoice
    //      - aggregated by content type
    //      - by author

}).call(this);
