import { nanoid } from "nanoid";
import { MigrationInterface, QueryRunner } from "typeorm";

const items = [
    { description: 'New York', stateProvince: 'NY', population: 8405837, lat: 40.7127837, lon: -74.0059413 },
    { description: 'Los Angeles', stateProvince: 'CA', population: 3884307, lat: 34.0522342, lon: -118.2436849 },
    { description: 'Chicago', stateProvince: 'IL', population: 2718782, lat: 41.8781136, lon: -87.6297982 },
    { description: 'Houston', stateProvince: 'TX', population: 2195914, lat: 29.7604267, lon: -95.3698028 },
    { description: 'Philadelphia', stateProvince: 'PA', population: 1553165, lat: 39.9525839, lon: -75.1652215 },
    { description: 'Phoenix', stateProvince: 'AZ', population: 1513367, lat: 33.4483771, lon: -112.0740373 },
    { description: 'San Antonio', stateProvince: 'TX', population: 1409019, lat: 29.4241219, lon: -98.4936282 },
    { description: 'San Diego', stateProvince: 'CA', population: 1355896, lat: 32.715738, lon: -117.1610838 },
    { description: 'Dallas', stateProvince: 'TX', population: 1257676, lat: 32.7766642, lon: -96.7969879 },
    { description: 'San Jose', stateProvince: 'CA', population: 998537, lat: 37.3382082, lon: -121.8863286 },
    { description: 'Austin', stateProvince: 'TX', population: 885400, lat: 30.267153, lon: -97.7430608 },
    { description: 'Indianapolis', stateProvince: 'IN', population: 843393, lat: 39.768403, lon: -86.158068 },
    { description: 'Jacksonville', stateProvince: 'FL', population: 842583, lat: 30.3321838, lon: -81.655651 },
    { description: 'San Francisco', stateProvince: 'CA', population: 837442, lat: 37.7749295, lon: -122.4194155 },
    { description: 'Columbus', stateProvince: 'OH', population: 822553, lat: 39.9611755, lon: -82.9987942 },
    { description: 'Charlotte', stateProvince: 'NC', population: 792862, lat: 35.2270869, lon: -80.8431267 },
    { description: 'Fort Worth', stateProvince: 'TX', population: 792727, lat: 32.7554883, lon: -97.3307658 },
    { description: 'Detroit', stateProvince: 'MI', population: 688701, lat: 42.331427, lon: -83.0457538 },
    { description: 'Memphis', stateProvince: 'TN', population: 653450, lat: 35.1495343, lon: -90.0489801 },
    { description: 'Seattle', stateProvince: 'WA', population: 652405, lat: 47.6062095, lon: -122.3320708 },
    { description: 'Denver', stateProvince: 'CO', population: 649495, lat: 39.7392358, lon: -104.990251 },
    { description: 'Washington', stateProvince: 'DC', population: 646449, lat: 38.9071923, lon: -77.0368707 },
    { description: 'Boston', stateProvince: 'MA', population: 645966, lat: 42.3600825, lon: -71.0588801 },
    { description: 'Nashville', stateProvince: 'TN', population: 634464, lat: 36.1626638, lon: -86.7816016 },
    { description: 'Baltimore', stateProvince: 'MD', population: 622104, lat: 39.2903848, lon: -76.6121893 },
    { description: 'Oklahoma City', stateProvince: 'OK', population: 610613, lat: 35.4675602, lon: -97.5164276 },
    { description: 'Louisville', stateProvince: 'KY', population: 609893, lat: 38.2526647, lon: -85.7584557 },
    { description: 'Portland', stateProvince: 'OR', population: 609456, lat: 45.5230622, lon: -122.6764816 },
    { description: 'Las Vegas', stateProvince: 'NV', population: 603488, lat: 36.1699412, lon: -115.1398296 },
    { description: 'Milwaukee', stateProvince: 'WI', population: 599164, lat: 43.0389025, lon: -87.9064736 },
    { description: 'Albuquerque', stateProvince: 'NM', population: 556495, lat: 35.0853336, lon: -106.6055534 },
    { description: 'Tucson', stateProvince: 'AZ', population: 526116, lat: 32.2217429, lon: -110.926479 },
    { description: 'Fresno', stateProvince: 'CA', population: 509924, lat: 36.7468422, lon: -119.7725868 },
    { description: 'Sacramento', stateProvince: 'CA', population: 479686, lat: 38.5815719, lon: -121.4943996 },
    { description: 'Long Beach', stateProvince: 'CA', population: 469428, lat: 33.7700504, lon: -118.1937395 },
    { description: 'Kansas City', stateProvince: 'MO', population: 467007, lat: 39.0997265, lon: -94.5785667 },
    { description: 'Mesa', stateProvince: 'AZ', population: 457587, lat: 33.4151843, lon: -111.8314724 },
    { description: 'Virginia Beach', stateProvince: 'VA', population: 448479, lat: 36.8529263, lon: -75.977985 },
    { description: 'Atlanta', stateProvince: 'GA', population: 447841, lat: 33.7489954, lon: -84.3879824 }
].map((item) => ({
    id: nanoid(),
    ...item
}))

export class PopulateCities1669134336524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const commands = items.map(({ id, stateProvince, lat, lon, population, description }) => `
            INSERT INTO "city" ("id" , "description", "lat", "lon", "population", "state_province_id", "archived", "created_at", "created_by_id", "updated_at", "updated_by_id")
            VALUES ('${id}', '${description.replace(
                /'/,
                "''"
            )}', '${lat}', '${lon}', '${population}', '${stateProvince}', false, current_timestamp, '1', NULL, NULL);
        `);
        const command = commands.join("\n");

        console.log(command);

        await queryRunner.query(command);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
