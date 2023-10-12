class Vec3
{
    constructor(x,y,z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    min()
    {
        return Math.min(this.x,this.y,this.z);
    }
    
    mid()
    {
        var array = [this.x,this.y,this.z];
        array.sort();
        return array[1];
    }
    
    max()
    {
        return Math.max(this.x,this.y,this.z);
    }

    edge_length(v)
    {
        return Math.sqrt((v.x-this.x)**2 + (v.y-this.y)**2 + (v.z-this.z)**2);
    }
}