import { Article } from '../../../features/blog/models/blog.model';

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'optimizing-last-mile-routing',
    title: 'Optimizing Last-Mile Routing for Urban E-commerce',
    excerpt: 'Strategies to reduce delivery times and fuel consumption using dynamic routing algorithms in high-density city grids.',
    content: `
      <h2>The Challenge of Urban Logistics</h2>
      <p>As e-commerce adoption reaches record heights in metropolitan hubs across India, logistics networks face unprecedented pressure. The final leg of delivery—often termed "last-mile routing"—now accounts for up to 53% of total shipping costs. The complexity of routing through high-density urban grids presents distinct bottlenecks including vehicle payload limitations, traffic congestions, and narrow delivery windows.</p>
      
      <h2>Dynamic Routing Algorithms</h2>
      <p>Traditional static routing models, where delivery agents follow fixed daily paths, are no longer viable. Modern logistics operations rely on dynamic routing algorithms that integrate live traffic feeds, road construction warnings, and real-time package status changes. These models use heuristic solvers like the Vehicle Routing Problem (VRP) to optimize sequences on the fly.</p>
      
      <blockquote>
        "By implementing real-time routing engines, fleets can reduce fuel usage by 15-20% while improving on-time SLAs."
      </blockquote>
      
      <h2>Key Implementation Tactics</h2>
      <ul>
        <li><strong>Geofenced Micro-hubs:</strong> Relocating sorting closer to high-density zones reduces absolute transit miles.</li>
        <li><strong>Real-time Fleet Telemetry:</strong> Equipping vehicles with GPS transponders allows route adjustments mid-trip.</li>
        <li><strong>Predictive Traffic Mapping:</strong> Applying machine learning to historical traffic trends to pre-emptively avoid jams.</li>
      </ul>
    `,
    date: 'Oct 12, 2023',
    readTime: '5 min',
    category: 'Guides',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn_n2ppI5wc2LXMtU70Spaz7Ba9Imzwax5qBJNKqSnmW4qRJbTZhm3GKnnw-M2rn8vAI8ppav3D44BQ2aYvgKkNO3VydIWIrfe1NBgv_HXjKpoBC3ZLWtaWZw_4n2X9FF1-Kay_OYnUQWOwN-bhQoae_KsI4UNM5XXocHL_GI1d_bUINX4cQ4S8C6U7iCLpA2oMjQIrTC0095W0vbaydSTja4bkPjyqWp1f1qzQWyfcUunPCp1wdvIIMSarWED1Y2DKUu9USzy82jZ',
    author: 'James Doe',
    authorInitials: 'JD',
    authorBgClass: 'bg-tertiary-fixed text-on-tertiary-fixed'
  },
  {
    id: 'port-congestion-eases',
    title: 'Port Congestion Eases as New Automated Terminals Open',
    excerpt: 'Global shipping times see a 12% improvement this quarter following major infrastructure upgrades in key transpacific hubs.',
    content: `
      <h2>Automation at the Docks</h2>
      <p>Marine port terminals are undergoing a major transition toward fully automated operations. Automated guided vehicles (AGVs) and automated stacking cranes (ASCs) are replacing older, manually operated diesel machinery, significantly increasing container throughput capacity per square kilometer.</p>
      
      <h2>Measurable Transpacific Gains</h2>
      <p>Recent analytics show average container wait times at major transpacific hubs have decreased by 1.8 days compared to last quarter. This 12% operational lift relieves container shortage stresses globally and reduces spot freight rates for importers.</p>
      
      <h2>Future Outlook</h2>
      <p>Industry analysts expect automated terminal capacity to double by 2028. This infrastructure expansion is critical for managing the next decade's bulk shipping growth and stabilizing global supply chain networks against localized shocks.</p>
    `,
    date: 'Oct 10, 2023',
    readTime: '3 min',
    category: 'News',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn_n2ppI5wc2LXMtU70Spaz7Ba9Imzwax5qBJNKqSnmW4qRJbTZhm3GKnnw-M2rn8vAI8ppav3D44BQ2aYvgKkNO3VydIWIrfe1NBgv_HXjKpoBC3ZLWtaWZw_4n2X9FF1-Kay_OYnUQWOwN-bhQoae_KsI4UNM5XXocHL_GI1d_bUINX4cQ4S8C6U7iCLpA2oMjQIrTC0095W0vbaydSTja4bkPjyqWp1f1qzQWyfcUunPCp1wdvIIMSarWED1Y2DKUu9USzy82jZ',
    author: 'Sarah Wong',
    authorInitials: 'SW',
    authorBgClass: 'bg-secondary-fixed text-on-secondary-fixed'
  },
  {
    id: 'net-zero-carbon-accounting',
    title: 'The Path to Net-Zero: Carbon Accounting in Logistics',
    excerpt: 'A comprehensive look at how top-tier logistics providers are moving beyond simple offsets to implement rigorous Scope 3 emissions tracking.',
    content: `
      <h2>Scope 3 Emissions: The Real Logistics Challenge</h2>
      <p>Carbon offsets have long been criticized as a superficial fix for supply chain emissions. Today, the focus has shifted toward active decarbonization through Scope 3 carbon accounting—tracking indirect emissions generated across the entire supplier and courier ecosystem.</p>
      
      <h2>Methodologies for Rigorous Tracking</h2>
      <p>Leading supply chains are integrating carbon accounting directly into their transport management systems (TMS). By calculating fuel consumption metrics based on exact vehicle engine specs and shipment weight, companies can generate verifiable carbon footprint audits.</p>
      
      <h2>Strategic Reduction</h2>
      <p>Scope 3 analysis often reveals that shifting even 10% of shipments from road to rail, or using regional EV micro-fulfillment grids, reduces net operational carbon intensity by up to 35%. Rigorous data is the first step toward true net-zero targets.</p>
    `,
    date: 'Oct 05, 2023',
    readTime: '8 min',
    category: 'Insights',
    imageUrl: '',
    author: 'Editorial Team',
    authorInitials: 'ET',
    authorBgClass: 'bg-primary-fixed text-on-primary-fixed',
    highlighted: true
  },
  {
    id: 'implementing-micro-fulfillment-centers',
    title: 'Implementing Micro-Fulfillment Centers for Rapid E-commerce',
    excerpt: 'A step-by-step guide to identifying optimal locations, selecting automation technology, and integrating inventory management systems for localized distribution hubs.',
    content: `
      <h2>What are Micro-Fulfillment Centers?</h2>
      <p>Micro-Fulfillment Centers (MFCs) are small-scale warehouse facilities located in urban residential sectors, designed to accelerate order picking and enable under-2-hour local deliveries. MFCs bridge the gap between regional distribution mega-warehouses and local consumers.</p>
      
      <h2>The Implementation Roadmap</h2>
      <ol>
        <li><strong>Site Selection:</strong> Repurposing underutilized retail storefronts or parking spaces to capture high-density pockets.</li>
        <li><strong>Technology Selection:</strong> Utilizing vertical shuttle arrays and automated sorting bins to maximize inventory density in tight footprints.</li>
        <li><strong>System Integration:</strong> Linking real-time inventory signals from e-commerce sites (Shopify, WooCommerce) with local picker queues to start dispatching within minutes.</li>
      </ol>
      
      <h2>The Cost-Benefit Analysis</h2>
      <p>While the initial capital expenditure of urban MFC automation is significant, it reduces average last-mile delivery distance by 70%, offsetting setup costs within 18 months via dispatch efficiencies.</p>
    `,
    date: 'Sep 28, 2023',
    readTime: '12 min',
    category: 'Guides',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARoFe4VFipfxOmXY-bcVZQcfwDX8dLdt0-bxEYFgyK9c3aTiOvIqlk2fRPsg1qdmNahAOD9MbdmYRqoFgVIEUC2MQxJbgEifVBFHGdGGFU8VCkETnknMVRX7gvPuQkV-OGWyUGPPq2sAGcNK5bzLLyfT1TgYO5BA8VLMEeOIrVxrw-tMWJLr-xxQ2_f79g-QvvMamoNvfqrEJCrPyiGL-AY2EQajbiowcC1_YH8d6Q0ddb3VNQyChwC1iTh6RDydoGbrEvD7TJ6U_q',
    author: 'Marcus Chen',
    authorInitials: 'MC',
    authorBgClass: 'bg-tertiary-fixed text-on-tertiary-fixed'
  }
];
