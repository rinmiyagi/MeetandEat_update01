
import { assert, assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import {
    calculateCentroid,
    searchNearbyStations,
    computeTransitMatrix,
    searchRestaurants,
    findOptimalTime,
    selectBestStation,
    LatLng
} from "../logic.ts";

Deno.test("calculateCentroid - basic math", () => {
    const locations = [
        { lat: 10, lng: 10 },
        { lat: 20, lng: 20 },
        { lat: 30, lng: 30 }
    ];
    const centroid = calculateCentroid(locations);
    assertEquals(centroid.lat, 20);
    assertEquals(centroid.lng, 20);
});

Deno.test("API Logic Flow - Mocked", async (t) => {
    // Override global fetch
    const originalFetch = globalThis.fetch;

    await t.step("searchNearbyStations - returns mapped stations", async () => {
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            // Mock Google Places response
            return new Response(JSON.stringify({
                places: [
                    { displayName: { text: "Shinagawa" }, location: { latitude: 35.6, longitude: 139.7 } }
                ]
            }));
        };

        const result = await searchNearbyStations({ lat: 35, lng: 139 }, "mock-key");
        assertEquals(result.length, 1);
        assertEquals(result[0].name, "Shinagawa");
        assertEquals(result[0].location.lat, 35.6);
    });

    await t.step("searchRestaurants - returns mapped restaurant info", async () => {
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            // Mock Hotpepper response
            return new Response(JSON.stringify({
                results: {
                    shop: [
                        {
                            name: "Delicious BBQ",
                            address: "Tokyo",
                            photo: { pc: { l: "http://img.com/l.jpg" } },
                            budget: { name: "3000 yen", average: "3500" },
                            catch: "Best Meat!"
                        }
                    ]
                }
            }));
        };

        const result = await searchRestaurants({ lat: 35.6, lng: 139.7 }, "mock-key");
        assertEquals(result[0].name, "Delicious BBQ");
        assertEquals(result[0].photo.pc.l, "http://img.com/l.jpg");
        assertEquals(result[0].budget.name, "3000 yen");
        assertEquals(result[0].catch, "Best Meat!");
    });

    // Restore fetch
    globalThis.fetch = originalFetch;
});

Deno.test("findOptimalTime - logic check", () => {
    // Case 1: Clear winner
    const schedules1 = [
        { date: "2024-01-01T19:00:00" },
        { date: "2024-01-01T19:00:00" },
        { date: "2024-01-02T19:00:00" }
    ];
    assertEquals(findOptimalTime(schedules1), new Date("2024-01-01T19:00:00").toISOString());

    // Case 2: Tie break (pick earliest)
    const schedules2 = [
        { date: "2024-01-02T19:00:00" },
        { date: "2024-01-01T19:00:00" }
    ];
    assertEquals(findOptimalTime(schedules2), new Date("2024-01-01T19:00:00").toISOString());

    // Case 3: Empty - Fallback (Just check it returns a string, explicit format might depend on current date)
    const result3 = findOptimalTime([]);
    assert(result3.length > 0);
});

Deno.test("selectBestStation - logic check", () => {
    const stations = [
        { name: "A", location: { lat: 0, lng: 0 } },
        { name: "B", location: { lat: 0, lng: 0 } }
    ];

    // index 0 -> duration 100, index 1 -> duration 50
    const matrix = [
        { originIndex: 0, destinationIndex: 0, duration: "100s" },
        { originIndex: 0, destinationIndex: 1, duration: "50s" }
    ];

    const best = selectBestStation(stations, matrix);
    assertEquals(best.name, "B");
});
