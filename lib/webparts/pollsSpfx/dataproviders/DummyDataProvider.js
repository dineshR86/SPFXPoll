"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MockUpDataProvider = (function () {
    function MockUpDataProvider() {
    }
    /**
     * Returns sample data
     */
    MockUpDataProvider.prototype.readsPollItemsFromList = function () {
        var publisheddate1 = new Date();
        publisheddate1.setDate(new Date().getDate() - 5);
        var publisheddate2 = new Date();
        publisheddate2.setDate(new Date().getDate() - 3);
        var expirydate1 = new Date();
        expirydate1.setDate(new Date().getDate() + 5);
        var expirydate2 = new Date();
        expirydate2.setDate(new Date().getDate() + 3);
        var _items = [
            {
                Id: 1,
                PollQuestion: "This is my first poll question",
                Options: [{
                        key: "A",
                        text: "FirstPollOption1",
                        checked: true
                    },
                    {
                        key: "B",
                        text: "FirstPollOption2",
                        checked: false
                    },
                    {
                        key: "C",
                        text: "FirstPollOption3",
                        checked: false
                    }],
                PublishedDate: publisheddate1,
                ExpiryDate: expirydate1,
                CurrentPollItem: false,
                SelectedOptionkey: null
            },
            {
                Id: 2,
                PollQuestion: "This is my second poll question",
                Options: [{
                        key: "A",
                        text: "SecondPollOption1",
                        checked: true
                    },
                    {
                        key: "B",
                        text: "SecondPollOption2",
                        checked: false
                    },
                    {
                        key: "C",
                        text: "SecondPollOption3",
                        checked: false
                    }],
                PublishedDate: publisheddate2,
                ExpiryDate: expirydate2,
                CurrentPollItem: true,
                SelectedOptionkey: null
            },
            {
                Id: 3,
                PollQuestion: "How does your family make the little moments matter?",
                Options: [{
                        key: "A",
                        text: "Having breakfast together in the morning",
                        checked: true
                    },
                    {
                        key: "B",
                        text: "stuck in traffic",
                        checked: false
                    },
                    {
                        key: "C",
                        text: "Walking to school",
                        checked: false
                    },
                    {
                        key: "D",
                        text: "Dinner time",
                        checked: false
                    },
                    {
                        key: "E",
                        text: "Cooking together",
                        checked: false
                    },
                    {
                        key: "F",
                        text: "Playing games",
                        checked: false
                    }],
                PublishedDate: publisheddate2,
                ExpiryDate: expirydate2,
                CurrentPollItem: false,
                SelectedOptionkey: null
            },
            {
                Id: 4,
                PollQuestion: "How do you show you care everyday? By",
                Options: [{
                        key: "A",
                        text: "Putting each other and our customers, residents, patients at the heart of everything we do",
                        checked: true
                    },
                    {
                        key: "B",
                        text: "Acting in people’s best interests ",
                        checked: false
                    },
                    {
                        key: "C",
                        text: "Making things easier and faster for people",
                        checked: false
                    },
                    {
                        key: "D",
                        text: "Empowering people and providing them with choice & control",
                        checked: false
                    },
                    {
                        key: "E",
                        text: "Making things easier and faster for people",
                        checked: false
                    },
                    {
                        key: "F",
                        text: "Demonstrating that we know our stuff and provide the best ",
                        checked: false
                    },
                    {
                        key: "C",
                        text: "service and advice",
                        checked: false
                    }],
                PublishedDate: publisheddate2,
                ExpiryDate: expirydate2,
                CurrentPollItem: false,
                SelectedOptionkey: null
            },
            {
                Id: 5,
                PollQuestion: "What are you looking forward to most in 2018?",
                Options: [{
                        key: "A",
                        text: "Getting fit/healthy",
                        checked: true
                    },
                    {
                        key: "B",
                        text: "Spending more time with family and friends",
                        checked: false
                    },
                    {
                        key: "C",
                        text: "Reading a good book",
                        checked: false
                    },
                    {
                        key: "D",
                        text: "Eating all the food",
                        checked: false
                    }],
                PublishedDate: publisheddate1,
                ExpiryDate: expirydate1,
                CurrentPollItem: false,
                SelectedOptionkey: null
            }
        ];
        return new Promise(function (resolve) {
            resolve(_items);
        });
    };
    MockUpDataProvider.prototype.submitPollResult = function (data) {
        debugger;
        console.log(data);
        return Promise.reject(new Error(JSON.stringify("rejected")));
    };
    MockUpDataProvider.prototype.updatePollCount = function (pollid, count) {
        console.log("Dummy Data");
    };
    MockUpDataProvider.prototype.getResultsData = function (pollid, options) {
        var items = [];
        return new Promise(function (resolve) {
            resolve(items);
        });
    };
    MockUpDataProvider.prototype.getPollLogByUser = function (userId) {
        var items = [];
        return new Promise(function (resolve) {
            resolve(items);
        });
    };
    MockUpDataProvider.prototype.getCurrentUser = function () {
        var items = [];
        return new Promise(function (resolve) {
            resolve(items);
        });
    };
    return MockUpDataProvider;
}());
exports.default = MockUpDataProvider;

//# sourceMappingURL=DummyDataProvider.js.map
