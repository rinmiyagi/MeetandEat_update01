
import { assert, assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { calculateCentroid, searchNearbyStations, computeTransitMatrix, searchRestaurants, LatLng } from "../logic.ts";

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
