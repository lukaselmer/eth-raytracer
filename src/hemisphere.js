var Hemisphere = function (_center, _radius, _ambient, _diffuse, _specular, _specularExp, _inner_ambient, _inner_diffuse, _inner_specular, _inner_specularExp, _refraction_idx) {
    this.center = _center;
    this.radius = _radius;
    this.ambient = _ambient;
    this.diffuse = _diffuse;
    this.specular = _specular;
    this.specular_exp = _specularExp;
    this.refraction_idx = _refraction_idx;
};

Hemisphere.prototype.getNormal = function (intersectionPoint) {
    return intersectionPoint.subtract(this.center).toUnitVector();
}

Hemisphere.prototype.intersects = function (ray) {
    var o = ray.line.anchor;       // ray origin
    var d = ray.line.direction;    // ray vector
    var c = this.center;      // sphere center
    var r = this.radius;      // sphere radius
    var r2 = r*r;             // sphere radius squared

    // c-o : vector from ray origin to sphere center
    var oc = c.subtract(o);

    // ||c-o||^2 : squared-distance from ray origin to sphere center
    var oc2 = oc.dot(oc);

    // (c-o)*d : compute ray distance which is closest to sphere center
    var ocd = oc.dot(d);
    var ocd2 = ocd*ocd;

    // reject if ray is outside or points away from sphere
    if (ocd < 0)
        return null;

    // D^2 = ||c-o||^2 - ((c-o)*d)^2 : compute shortest squared-distance from sphere center to ray
    var D2 = oc2 - ocd2;

    // reject if greater than squared radius
    if (D2 > r2)
        return null;

    // t = (o-c)*d ± sqrt(r^2 - D^2) : compute half-chord squared-distance
    var r2D2 = r2 - D2;
    if (r2D2 < 0)
        return null;

    var t1 = ocd - Math.sqrt(r2D2);
    var t2 = ocd + Math.sqrt(r2D2);

    // no intersection (or just self-intersection)
    if (t1 < RayConfig.intersection_delta && t2 < RayConfig.intersection_delta) return null;

    var t_min = 0;
    var t_max = 0;

    // just one intersection (or self-intersection)
    if (t1 < RayConfig.intersection_delta && t2 >= RayConfig.intersection_delta) { t_min = t2; t_max = t2; }
    if (t2 < RayConfig.intersection_delta && t1 >= RayConfig.intersection_delta) { t_min = t1; t_max = t1; }

    // two intersections
    if (t1 >= RayConfig.intersection_delta && t2 >= RayConfig.intersection_delta) { t_min = Math.min(t1, t2); t_max = Math.max(t1, t2); }


    return [t_min, this.getNormal(ray.line.anchor.add(ray.line.direction.multiply(t_min))), t_max];
}