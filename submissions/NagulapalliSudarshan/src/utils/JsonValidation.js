function validateJsonStructure(jsonText) {
    let parsed;
  
    // Check if it is valid JSON text
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      return { valid: false, error: 'Invalid JSON text.' };
    }
  
    // Check for required top-level structure
    if (
      typeof parsed !== 'object' ||
      !Array.isArray(parsed.nodes) ||
      !Array.isArray(parsed.edges) ||
      typeof parsed.meta !== 'object' ||
      parsed.nodes === null ||
      parsed.edges === null ||
      parsed.meta === null
    ) {
      return {
        valid: false,
        error: 'JSON must have "nodes" (array), "edges" (array), and "meta" (object).'
      };
    }
  
    return { valid: true };
}

export default validateJsonStructure;
  