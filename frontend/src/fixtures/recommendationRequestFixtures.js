const recommendationRequestFixtures = {
    oneRecommendation: {
        "id": 1,
        "requesterEmail": "abc@ucsb.edu",
        "professorEmail": "xyz@ucsb.edu",
        "explanation": "BS/MS Program",
        "dateRequested": "2023-10-10T12:12:12",
        "dateNeeded": "2024-12-12T10:10:10",
        "done": false
    },
    threeRecomendation: [
        {
            "id": 1,
            "requesterEmail": "abc@ucsb.edu",
            "professorEmail": "xyz@ucsb.edu",
            "explanation": "BS/MS Program",
            "dateRequested": "2023-10-10T12:12:12",
            "dateNeeded": "2024-12-12T10:10:10",
            "done": false
        },
        {
            "id": 2,
            "requesterEmail": "cgaucho@ucsb.edu",
            "professorEmail": "cgaucho@ucsb.edu",
            "explanation": "MS CS UCLA",
            "dateRequested": "2022-07-18T09:02:10",
            "dateNeeded": "2023-12-12T03:08:17",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "abc@ucsb.edu",
            "professorEmail": "xyz@ucsb.edu",
            "explanation": "PhD CS Stanford",
            "dateRequested": "2023-08-04T12:12:12",
            "dateNeeded": "2023-08-06T15:15:15",
            "done": false
        }
    ]
};


export { recommendationRequestFixtures };